const data = d3.json("global-temperature.json").then(data => {
    heatMap( data )
})

function heatMap( data ) {
    const { baseTemperature, monthlyVariance } = data

    const root = d3.select("body")
    
    monthlyVariance.map( d => d.month--)

    root.append("h1")
    .attr("id","title")
    .text("Monthly Global Land-Surface Temperature")

    root.append("h3")
    .attr("id","description")
    .text(`${monthlyVariance[0].year} - ${monthlyVariance[monthlyVariance.length - 1].year}: Base Temperature ${ baseTemperature }˚C`)
}