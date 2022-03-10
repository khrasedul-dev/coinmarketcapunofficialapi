const express = require('express')
const app = express()


app.get('/',(req,res)=>{
  
  const axios = require('axios')
  const cheerio = require('cheerio')
  
  let dataArray = []
  
  axios.get('https://coinmarketcap.com/').then((data)=>{
    
      const $ = cheerio.load(data.data)
      const selector = '.cmc-table > tbody > tr'

      $(selector).each((index,element)=>{

          if (index <= 9) {

              let keys = [
                'Rank',
                'Name',
                'Price',
                '24H',
                '7D',
                'MarketCap',
                '24H Volume',
                'CalculatingSuply' 
              ]

              let coinObject = {}

              $(element).children().each((childIdx,childElm)=>{


                  let finalData = $(childElm).text()
                  if(childIdx === 2 || childIdx === 7){
                      finalData = $('div>a>div>div>p:first-child',$(childElm).html()).text()
                  }

                  if(finalData){
                    coinObject[keys[childIdx-1]] = finalData
                  }
                
              })
            
              dataArray.push(coinObject)

          }

      })
    
      res.json(dataArray)

  }).catch((e)=>console.log(e))
  
  
  
})

const port = process.env.PORT || 8080

app.listen(port,(e)=>{
  console.log('Server is running on ' + port)
})