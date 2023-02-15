const express = require('express');
const path = require('path');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require ('./utils/forecast');

const app = express();

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Alvaro Rodriguez-Salas'
    })
});

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Alvaro Rodriguez-Salas'
    });
});

app.get('/help', (req,res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Alvaro Rodriguez-Salas'
    });
});

app.get('/weather', (req,res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }


    geocode(req.query.address, (error, {latitude, longitude, location }) => {
        if (error) {
            return res.send ({ error })
        }   

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send ({ error })
            }

            res.send ({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })

 }); 



app.get('/products', (req,res) => {
    if (!req.query.search) {
        return res.send({
          error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send ({
        products: []
    })
}); 


app.get('/help/*', (req,res) => {
    res.render('404', {
        title: '404',
        name: 'Alvaro Rodriguez-Salas',
        errorMessage: 'Help article not found.'
    })
});

app.get('*', (req,res) => {
    res.render('404', {
        title: '404',
        name: 'Alvaro Rodriguez-Salas',
        errorMessage: 'Page not found.'
    });
});



app.listen(3000, () => console.log('Server listening on 3000')
)


// const geocode = require('./utils/geocode')
// const forecast = require('./utils/forecast')

// const address = process.argv[2]

// if (!address) {
//     console.log('Please provide an address')
// } else {
//     geocode(address, (error, { latitude, longitude, location }) => {
//         if (error) {
//             return console.log(error)
//         }

//         forecast(latitude, longitude, (error, forecastData) => {
//             if (error) {
//                 return console.log(error)
//             }

//             console.log(location)
//             console.log(forecastData)
//         })
//     })
// }

