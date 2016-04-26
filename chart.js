export default function chart_js(d3, container, judet, {width, height}) {

  var padding = 2

  var cols = [
    'servicii_publice_generale',
    'aparare',
    'invatamant',
    'sanatate',
    'cultura',
    'asigurari_sociale',
    'dezvoltare_locuinte_mediu',
    'mediu',
    'energie',
    'transporturi',
    'altele',
  ]
  var years = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014]
  var yearWidth = (width-2*padding)/years.length
  var yearSlotLeft = yearWidth/20

  var color = {
    aparare: '#44529F',
    asigurari_sociale: '#D95F7E',
    mediu: '#46876F',
    invatamant: '#9FCCB2',
    sanatate: '#9295CA',
    dezvoltare_locuinte_mediu: '#E5C53D',
    servicii_publice_generale: '#84B5DF',
    cultura: '#782764',
    energie: '#E6763C',
    transporturi: '#52B9BB',
    altele: '#B2B2B2',
  }


  var x = d3.scale.ordinal()
      .rangeRoundBands([yearSlotLeft, yearWidth], .1)

  var y = d3.scale.linear()
      .range([height-2*padding, 0])

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('right')
      .ticks(3)
      .innerTickSize(width-2*padding)
      .tickFormat((d) => d ? d : '')

  var svg = container.append('g')
      .attr('transform', `translate(${padding},${padding})`)

  x.domain(cols)
  y.domain([0, d3.max(years, (y) => d3.max(cols, (c) => +judet.years[y][c]))])

  svg.selectAll('.year')
      .data(years)
    .enter().append('g')
      .each(function(g, i) {
        var year = judet.years[years[i]]
        d3.select(this)
          .attr('transform', `translate(${yearWidth*i},0)`)
          .selectAll('.bar')
            .data(cols)
          .enter().append('rect')
            .attr('class', 'bar')
            .attr('fill', (d) => color[d])
            .attr('x', (d) => x(d))
            .attr('width', x.rangeBand())
            .attr('y', (d) => y(+year[d]))
            .attr('height', (d) => height-2*padding - y(+year[d]))
      })

  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)

  svg.selectAll('.axis text')
      .attr('style', 'font: 10px sans-serif; text-anchor: end')
      .attr('transform', 'translate(-4,6)')

  svg.selectAll('.x.axis path').remove()

  svg.selectAll('.axis path').attr('style', 'fill: none; stroke: #000; shape-rendering: crispEdges')
  svg.selectAll('.axis line').attr('style', 'fill: none; stroke: #000; shape-rendering: crispEdges')

  //function multiYearLine(c) {
  //  var coords = years.map((year, i) => {
  //    return [yearWidth*i + x(c), height-2*padding - y(+judet.years[year][c])]
  //  })
  //  return `M ${coords.join(' ')}`
  //}

  //svg.selectAll('.multiYearLine')
  //    .data(cols)
  //  .enter().append('path')
  //    .attr('d', multiYearLine)
}
