package users

import (
	"context"
	"errors"
	"net/http"
	"web/backend/db"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
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

		err := db.UsersColl.FindOne(
			context.TODO(),
			bson.M{
				"name": newUser.Name,
			},
		).Err()
		if err != nil {
			if !errors.Is(err, mongo.ErrNoDocuments) {
				c.IndentedJSON(http.StatusForbidden, gin.H{
					"error": "user with this username/name already exists",
				})
				return
			} else {
				c.IndentedJSON(http.StatusInternalServerError, gin.H{
					"error": "some internal datbase problem while trying to figure out if user already exists in our database",
				})
				return
			}
		}

		insertResults, err := db.UsersColl.InsertOne(
			context.TODO(),
			newUser,
		)
		if err != nil || !insertResults.Acknowledged {
			c.IndentedJSON(http.StatusInternalServerError, gin.H{
				"error": "could not create new user because some internal database problem happened",
			})
			return
		}

		c.IndentedJSON(http.StatusCreated, gin.H{
			"success": "new user created successfully",
		})
	})
}
