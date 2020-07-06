const data = d3.json("global-temperature.json").then(data => {
    heatMap( data )
})

function heatMap( data ) {
    const { baseTemperature, monthlyVariance } = data

    const root = d3.select("body")
    
    monthlyVariance.map( d => {
        d.month--
        d.temperature = d.variance + baseTemperature
    })

    root.append("h1")
    .attr("id","title")
    .text("Monthly Global Land-Surface Temperature")

    root.append("h3")
    .attr("id","description")
    .text(`${monthlyVariance[0].year} - ${monthlyVariance[monthlyVariance.length - 1].year}: Base Temperature ${ baseTemperature }˚C`)

    const chartSize = {
        width: 1500,
        height: 250,
        padding: {
            top: 50,
            left: 150,
            right: 50,
            bottom: 200,
        }
    }

    const chart = root.append("svg")
    .attr("width", chartSize.width)
    .attr("height", chartSize.height)
    .classed("chart")
}