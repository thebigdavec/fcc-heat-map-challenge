const data = d3.json('global-temperature.json').then((data) => {
	heatMap(data);
});

function heatMap(globalTemperatures) {
	const { baseTemperature, monthlyVariance } = globalTemperatures;

	const root = d3.select('body').append('div').attr('id', 'root');

	monthlyVariance.map((d) => {
		d.month--;
		d.monthDate = new Date(0, d.month);
		d.temperature = baseTemperature + d.variance;
	});

	root.append('h1').attr('id', 'title').text('Monthly Global Land-Surface Temperature');

	root
		.append('h3')
		.attr('id', 'description')
		.text(
			`${monthlyVariance[0].year} - ${monthlyVariance[monthlyVariance.length - 1]
				.year}: Base Temperature ${baseTemperature}˚C`
		);

	const width = 1500;
	const height = 450;
	const paddingTop = 10;
	const paddingLeft = 85;
	const paddingRight = 20;
	const paddingBottom = 150;
	const cellWidth = width / (d3.max(monthlyVariance, (d) => d.year) - d3.min(monthlyVariance, (d) => d.year));
	const cellHeight = (height - paddingTop - paddingBottom) / 12;

	const chart = root.append('svg').attr('width', width).attr('height', height).classed('chart', true);

	const xScale = d3
		.scaleLinear()
		.domain([ d3.min(monthlyVariance, (d) => d.year), d3.max(monthlyVariance, (d) => d.year) ])
		.range([ paddingLeft, width - paddingRight ]);
	const yScale = d3
		.scaleTime()
		.domain([ new Date(0, 0), new Date(0, 11) ])
		.range([ paddingTop, height - paddingBottom ]);
	const colorScale = d3
		.scaleLinear()
		.domain([ d3.min(monthlyVariance, (d) => d.variance), d3.max(monthlyVariance, (d) => d.variance) ])
		.range([ 210, 0 ]);

	// //temporary grid for width of chart
	// const widthScale = d3.scaleLinear().domain([ 0, width ]).range([ 0, width ]);
	// const widthAxis = d3.axisTop(widthScale).ticks(15).tickSize(height - paddingTop);

	// chart.append('g').call(widthAxis).attr('transform', `translate(0, ${height})`);

	const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
	const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'));

	chart
		.selectAll('rect')
		.data(monthlyVariance)
		.enter()
		.append('rect')
		.attr('x', (d) => xScale(d.year))
		.attr('y', (d) => yScale(d.monthDate))
		.attr('width', cellWidth)
		.attr('height', cellHeight)
		.attr('fill', (d) => d3.hsl(colorScale(d.variance), 1, 0.5))
		.attr('stroke', 'black')
		.attr('data-month', (d) => d.month)
		.attr('data-year', (d) => d.year)
		.attr('data-temp', (d) => d.temperature)
		.classed('cell', true);

	chart
		.append('g')
		.attr('id', 'x-axis')
		.attr('transform', `translate (${0}, ${height - paddingBottom + cellHeight})`)
		.call(xAxis);

	chart
		.append('g')
		.attr('id', 'y-axis')
		.attr('transform', `translate (${paddingLeft}, ${cellHeight / 2})`)
		.call(yAxis);

	const legendHeight = paddingBottom * 0.6;
	const legendWidth = 600;
	const minTemperature = d3.min(monthlyVariance, (d) => d.temperature);
	const maxTemperature = d3.max(monthlyVariance, (d) => d.temperature);
	const temperatures = [];
	const numberOfColors = 9;
	for (let i = minTemperature; i <= maxTemperature; i += (maxTemperature - minTemperature) / numberOfColors) {
		temperatures.push(i);
	}
	const legendCellHeight = legendHeight * 0.5;
	const legendCellWidth = legendWidth / numberOfColors;
	const legend = chart
		.append('svg')
		.attr('id', 'legend')
		.attr('height', legendHeight)
		.attr('width', legendWidth)
		.attr('x', (width - legendWidth) / 2)
		.attr('y', height - legendHeight + paddingTop);

	const legendXScale = d3
		.scaleBand()
		.domain(temperatures)
        .range([ 0, legendWidth ])
        .padding(0.1);
    const legendXAxis = d3.axisBottom(legendXScale).ticks(3);
	const colors = d3
		.scaleLinear()
		.domain([ temperatures[0], temperatures[temperatures.length - 1] ])
		.range([ 210, 0 ]);

	legend.append('g').call(legendXAxis).attr('transform', `translate (0, ${legendCellHeight + 3})`);

	legend
		.selectAll('rect')
		.data(temperatures)
		.enter()
		.append('rect')
		.attr('id', (d) => d)
		.attr('x', (d) => legendXScale(d))
		.attr('y', 0)
		.attr('width', legendCellWidth)
		.attr('height', legendCellHeight)
		.attr('stroke-width', 3)
		.attr('fill', (d) => d3.hsl(colors(d), 1, 0.5));
}
