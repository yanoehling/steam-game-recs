const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('./model');
const jwt = require('jsonwebtoken');

router.post(
    '/login', 
    [
        body('userName').isString().withMessage('Nome de usuário é obrigatório'),
    body('password').isString().withMessage('Senha é obrigatória')
    ], 
    async (req, res) => {
        const { userName, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findOne({ userName });
            
            if (!user) {
                return res.status(401).json({ message: 'Usuário não encontrado' });
            }

            if (user.password !== password) {
                return res.status(401).json({ message: 'Senha incorreta' });
            }

            const token = jwt.sign(
                { userId: user._id, userName: user.userName },
                'sua_chave_secreta_aqui', // Você deve mover isso para variáveis de ambiente
                { expiresIn: '24h' }
            );

            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao fazer login' });
        }
    }
);

router.post(
    '/create', 
    [
        body('email').isEmail().withMessage('Email inválido'),
        body('password').isString().withMessage('Senha deve ter pelo menos 8 caracteres'),
        body('completeName').isString().withMessage('Nome completo deve ter pelo menos 3 caracteres'),
        body('userName').isString().withMessage('Nome de usuário deve ter pelo menos 3 caracteres'),
        body('dateOfBirth').isDate().withMessage('Data de nascimento inválida'),
    ],
    async (req, res) => {
        const { 
            completeName, 
            userName,
            dateOfBirth,
            email, 
            password,
        } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userExists = await User.findOne({ email, completeName, userName });
        if (userExists) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        const user = new User({
            completeName,
            userName,
            dateOfBirth,
            email,
            password,
        });

        try {
            await user.save();
            res.status(201).json({ message: 'Usuário criado com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar usuário' });
        }
    }
);

module.exports = router;