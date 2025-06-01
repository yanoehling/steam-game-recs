package main

import (
	"net/http"
	"web/backend/router"

	"github.com/gin-gonic/gin"
)

func main() {
	router.Router.GET(
		"/",
		func(ctx *gin.Context) {
			ctx.String(http.StatusOK, "Trabalho Web")
		},
	)

	router.Router.Run(":4000")
}
