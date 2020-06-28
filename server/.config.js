var config = {
    development: {
        //mongodb connection settings
        database: {
            url: 'mongodb://mentalhealthdb:6zG5DKK21AKLdyXydq2lZqyGwdRdQakWdZ9T8OcmOPl5d300PPXNdMFPCFD7GDMCdb2I0Va6y6oLK6CIVeSADw==@mentalhealthdb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@mentalhealthdb@'
        },
    },
    production: {
        //mongodb connection settings TODO!
        database: {
            url: 'mongodb://mentalhealthdb:6zG5DKK21AKLdyXydq2lZqyGwdRdQakWdZ9T8OcmOPl5d300PPXNdMFPCFD7GDMCdb2I0Va6y6oLK6CIVeSADw==@mentalhealthdb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@mentalhealthdb@'
        },
    }
    };
    module.exports = config;