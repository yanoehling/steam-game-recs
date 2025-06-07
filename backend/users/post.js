const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.post(
    '/', 
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