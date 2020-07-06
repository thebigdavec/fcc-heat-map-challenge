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
	const height = 350;
	const paddingTop = 50;
	const paddingLeft = 150;
	const paddingRight = 20;
	const paddingBottom = 100;
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
}
