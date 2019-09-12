const express=require('express');
const bodyParser=require('body-parser');
const graphqlHTTP=require('express-graphql');
const {buildSchema}=require('graphql');
const mongoose=require('mongoose');
const Event=require('./models/event');
const config=require('config');
const app=express();


app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
  
     schema: buildSchema(`
    
        type Event{
            _id:ID!
            title:String!
            description:String!
            price:Float!
            date:String!
        }

        input EventInput{
            title:String!
            description:String!
            price:Float!
            date:String!



        }

        type RootQuery{

            events:[Event!]!
        }
       
        type RootMutation{

            createEvent(eventInput:EventInput):Event

        }
        schema{
            query:RootQuery
            mutation:RootMutation


        }
     
     `),
     rootValue:{
        events: ()=> {
            return events
        },
         createEvent:args=>{
            const event= new Event({
                title:args.eventInput.title,
                description:args.eventInput.description,
                price: +args.eventInput.price,
                date:new Date(args.eventInput.date)

            });
              return  event.save()
            .then(result=>
                {
                    console.log(result);
                    return {... result._doc}
                }
            ).catch(err=>{
                console.log(err);
                throw err;

            });
       

         }


     },
      graphiql: true


}))
/*
mongoose.connect(`mongodb+srv://${process.env.user}:${process.env.pass}@cluster0-rkwtx.azure.mongodb.net/${process.env.db}?retryWrites=true&w=majority`)
.then(app.listen(3000,()=>console.log('listen with port 3000')))
.catch(err=>{
    console.log('mkech mconnecti m3a l base');
});
*/

/*
//connect to mlab database

mongoose.connect('mongodb+srv://malikovic:123456789m@cluster0-rkwtx.azure.mongodb.net/test?retryWrites=true&w=majority')

,{ useUnifiedTopology: true };
mongoose.connection.once('open',()=> 
{console.log('connected with database ')})
*/
    const db=config.get('db');
    mongoose.connect(db,{ useNewUrlParser: true })
    .then(()=> console.log(`connected with mongodb ${db}`));
    mongoose.set('useCreateIndex', true);



app.listen(4000,()=> console.log('listen with port 4000'));