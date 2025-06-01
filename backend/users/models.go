package users

import "time"

type User struct {
	Name        string    `json:"name" binding:"required"`
	DateOfBirth time.Time `json:"dateOfBirth" binding:"required"`
	UserName    string    `json:"username" binding:"required"`
	Password    string    `json:"password" binding:"required"`
}
