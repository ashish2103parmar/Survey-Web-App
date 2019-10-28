/**
 * Graphql Schema, Handlers
 */
var { buildSchema } = require('graphql');
var { CustomException, CustomExceptionCodes } = require("./exceptions");
var { surveyDB } = require("./cred");
var { validateEmail } = require("./util");
var DynamoDB = require("aws-sdk/clients/dynamodb")
var dynamodbClient = new DynamoDB({ region: "us-east-1" })


/**
 * Schema
 */
exports.schema = buildSchema(`
    type Error {
        code: String!
        msg:String!
    }

    type GenderReport {
        error: Error
        Male: Float
        Female: Float
        Unknown: Float
    }

    type PreferenceReport {
        error: Error
        AtHome: Int
        CoffeeSpecialists: Int
        OutWithFriends: Int
    }

    type BrandReport {
        error: Error
        StarBucks: Int
        Barista: Int
        Seven11: Int
        EZYMart: Int
        HudsonCoffee: Int
        Cafenatics: Int
        PieFace: Int
    }

    type Query {
        isPartOfSurvey(email: String!): Boolean
        genderReport: GenderReport
        preferenceReport: PreferenceReport
        brandReport: BrandReport
    }

    enum AgeGroup {
        A_19_25
        B_26_32
        C_33_Above
    }

    enum Gender {
        Male
        Female
        Unknown
    }

    enum PreferredPlace {
        AtHome
        CoffeeSpecialists
        OutWithFriends
    }

    enum PreferredShop {
        StarBucks
        Barista
        Seven11
        EZYMart
        HudsonCoffee
        Cafenatics
        PieFace
    }

    input Survey {
        name: String!
        ageGroup: AgeGroup!
        gender: Gender!
        drinkCoffee: Boolean!
        preferredPlace: PreferredPlace
        preferredShop: PreferredShop
    }

    type Mutation {
        submitSurvey(email: String!, survey: Survey!): Error
    }
`);

/**
 * Functions and Handlers
 */
exports.root = {
    /**
     * Submit Survey Entry
     */
    submitSurvey: ({ email, survey }) => new Promise((resolve) => {
        if (validateEmail(email)) {
            dynamodbClient.putItem({
                Item: {
                    [surveyDB.key]: {
                        S: email
                    },
                    ...DynamoDB.Converter.marshall(survey)
                },
                TableName: surveyDB.name,
                ConditionExpression: "attribute_not_exists(" + surveyDB.key + ")"
            }, (error) => {
                if (error) {
                    if (error.code === "ConditionalCheckFailedException") {
                        resolve(CustomException(CustomExceptionCodes.AlreadyExists, "Already Submitted"))
                    } else {
                        console.error("Submit Survey Error: Put Entry")
                        console.error(error)
                        resolve(CustomException(CustomExceptionCodes.UnknownError, "Something went wrong"))
                    }
                } else {
                    dynamodbClient.updateItem({
                        TableName: surveyDB.name,
                        Key: {
                            [surveyDB.key]: {
                                S: "Info"
                            }
                        },
                        UpdateExpression: "Set #G = if_not_exists(#G, :Z) + :O,  #GC = if_not_exists(#GC, :Z) + :GC" + (survey.drinkCoffee ? ", #P = if_not_exists(#P, :Z) + :O, #B = if_not_exists(#B, :Z) + :O" : ""),
                        ExpressionAttributeNames: {
                            "#G": survey.gender,
                            "#GC": survey.gender + "Coffee",
                            "#P": survey.preferredPlace,
                            "#B": survey.preferredShop
                        },
                        ExpressionAttributeValues: {
                            ":GC": {
                                N: survey.drinkCoffee ? "1" : "0"
                            },
                            ":Z": {
                                N: "0"
                            },
                            ":O": {
                                N: "1"
                            }
                        }
                    }, (error) => {
                        if (error) {
                            console.error("Submit Survey Error: Update Details")
                            console.error(error)
                            resolve(CustomException(CustomExceptionCodes.UnknownError, "Something went wrong"))
                        } else {
                            resolve()
                        }
                    })
                }
            })
        } else {
            resolve(CustomException(CustomExceptionCodes.InvalidRequest, "Invalid Email"))
        }
    }),
    /**
     * Check if part of survey
     */
    isPartOfSurvey: ({ email }) => new Promise((resolve) => {
        if (validateEmail(email)) {
            dynamodbClient.getItem({
                Key: {
                    [surveyDB.key]: {
                        S: email
                    }
                },
                TableName: surveyDB.name,
                ProjectionExpression: surveyDB.key
            }, (error, data) => {
                if (error) {
                    console.error("Is Part Of Survey Error: Check Email")
                    console.error(error)
                    resolve(false)
                } else {
                    if (data.Item) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            })
        } else {
            resolve(false)
        }
    }),
    /**
     * Gender Report
     */
    genderReport: () => new Promise((resolve) => {
        dynamodbClient.getItem({
            Key: {
                [surveyDB.key]: {
                    S: "Info"
                }
            },
            TableName: surveyDB.name,
            ProjectionExpression: "Male, Female, #UK, MaleCoffee, FemaleCoffee, UnknownCoffee",
            ExpressionAttributeNames: {
                "#UK": "Unknown"
            }
        }, (error, data) => {
            if (error) {
                console.error("Gender Report Error: Get Info")
                console.error(error)
                resolve({ error: CustomException(CustomExceptionCodes.UnknownError, "Something went wrong") })
            } else {
                if (data.Item) {
                    const result = data.Item
                    resolve({
                        Male: result.Male && result.Male.N && result.MaleCoffee ? result.MaleCoffee.N / result.Male.N : null,
                        Female: result.Female && result.Female.N && result.FemaleCoffee ? result.FemaleCoffee.N / result.Female.N : null,
                        Unknown: result.Unknown && result.Unknown.N && result.UnknownCoffee ? result.UnknownCoffee.N / result.Unknown.N : null
                    })
                } else {
                    resolve({})
                }
            }
        })
    }),
    /**
     * Preference Report
     */
    preferenceReport: () => new Promise((resolve) => {
        dynamodbClient.getItem({
            Key: {
                [surveyDB.key]: {
                    S: "Info"
                }
            },
            TableName: surveyDB.name,
            ProjectionExpression: "AtHome, CoffeeSpecialists, OutWithFriends"
        }, (error, data) => {
            if (error) {
                console.error("Preference Report Error: Get Info")
                console.error(error)
                resolve({ error: CustomException(CustomExceptionCodes.UnknownError, "Something went wrong") })
            } else {
                if (data.Item) {
                    resolve(DynamoDB.Converter.unmarshall(data.Item))
                } else {
                    resolve({})
                }
            }
        })
    }),
    /**
     * Brand Report
     */
    brandReport: () => new Promise((resolve) => {
        dynamodbClient.getItem({
            Key: {
                [surveyDB.key]: {
                    S: "Info"
                }
            },
            TableName: surveyDB.name,
            ProjectionExpression: "StarBucks, Barista, Seven11, EZYMart, HudsonCoffee, Cafenatics, PieFace"
        }, (error, data) => {
            if (error) {
                console.error("Brand Report Error: Get Info")
                console.error(error)
                resolve({ error: CustomException(CustomExceptionCodes.UnknownError, "Something went wrong") })
            } else {
                if (data.Item) {
                    resolve(DynamoDB.Converter.unmarshall(data.Item))
                } else {
                    resolve({})
                }
            }
        })
    })
}