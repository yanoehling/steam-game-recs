package users

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func POSTUsersRoutes() {
	usersRouter.POST("/create", func(c *gin.Context) {
		var newUser User

		if err := c.ShouldBindJSON(&newUser); err != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{
				"error": "invalid new user request data",
			})
			return
		}

		// checa se ja existe, se sim retorna erro
		// c.c. cria ele
	})
}
