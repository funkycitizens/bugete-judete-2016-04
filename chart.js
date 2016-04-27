export default function chart_js(d3, container, rows) {
  console.log(rows)

  let boxHeight = 34200
  let paddingTop = 2000
  let paddingBottom = 2000
  let width = 55880
  let height = boxHeight - paddingTop - paddingBottom


  var cols = [
    'aparare',
    'asigurari_sociale',
    'mediu',
    'invatamant',
    'sanatate',
    'dezvoltare_locuinte_mediu',
    'servicii_publice_generale',
    'cultura',
    'energie',
    'transporturi',
    'altele',
  ]
  var years = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
  var yearWidth = (width)/years.length
  var yearSlotPadding = yearWidth/20

  var color = {
    aparare: '#4B57A1',
    asigurari_sociale: '#DA6381',
    mediu: '#4C8A72',
    invatamant: '#A0CDB3',
    sanatate: '#9497CA',
    dezvoltare_locuinte_mediu: '#E5C744',
    servicii_publice_generale: '#86B6E0',
    cultura: '#7B3268',
    energie: '#E67943',
    transporturi: '#55BABC',
    altele: '#B4B4B4',
  }


  var x = d3.scale.ordinal()
      .rangeRoundBands([yearSlotPadding, yearWidth - yearSlotPadding], 0)

  var y = d3.scale.linear()
      .range([height, 0])

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('right')
      .ticks(3)
      .innerTickSize(width)
      .tickFormat((d) => d ? d3.format(',')(d).replace(/,/g, ' ') : '')

  var svg = container.append('g')
      .attr('transform', `translate(${0},${paddingTop})`)

  x.domain(cols)
  y.domain([0, d3.max(years, (y) => d3.max(cols, (c) => +rows[y][c]))])

  let eachYear = svg.selectAll('.year')
      .data(years)
    .enter().append('g')

  eachYear.each(function(g, i) {
        var year = rows[years[i]]
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
            .attr('height', (d) => height - y(+year[d]))
      })

  eachYear
    .append('g')
      .attr('transform', `translate(300,${height + 200})`)
    .append('g')
      .attr('transform', 'scale(.95,1)')
    .append('path')
      .attr('style', 'stroke:#373435;stroke-width:17.64; fill:none;fill-rule:nonzero')
      .attr('transform', 'translate(-7639.18,-3598.2182)')
      .attr('d', 'm 12985,3600 c 0,83 -68,150 -151,150 m -5036,0 c -83,0 -150,-67 -150,-150 m 2518,109 -2368,41 m 2669,-41 c -83,0 -151,67 -151,151 0,-84 -67,-151 -150,-151 m 2668,41 -2367,-41')

  eachYear.append('g')
      .attr('transform', `translate(${yearWidth/2 + 150},${height + 1200})`)
      .append('text')
        .attr('style', 'font-size: 700px; font-family: "RO Gotham", sans-serif; text-anchor: middle')
        .text((d) => d)

  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)

  svg.selectAll('.axis text')
      .attr('style', 'font-size: 400px; font-family: "RO Gotham", sans-serif')
      .attr('transform', 'translate(-4,6)')
      .attr('x', 100)
      .attr('y', 500)

  svg.selectAll('.x.axis path').remove()
  svg.selectAll('.axis .domain').remove()

  svg.selectAll('.axis path').attr('style', 'stroke-width: 20px; fill: none; stroke: #000; shape-rendering: crispEdges')
  svg.selectAll('.axis line').attr('style', 'stroke-width: 20px; fill: none; stroke: #000; shape-rendering: crispEdges')

}
