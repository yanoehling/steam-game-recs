package db

import (
	"log"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var DbClient *mongo.Client
var WebDb *mongo.Database

var UsersColl *mongo.Collection

func ConnectToDb() {
	uri := "mongodb://localhost:27017"
	dbClient, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatalf("ERRO: NAO FOI POSSIVEL SE CONECTAR AO DB V2: %v", err)
	}
	DbClient = dbClient

	UsersColl.Database().Collection("users")
}
