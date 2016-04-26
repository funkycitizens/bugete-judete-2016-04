export default function chart_js(d3, container, judet) {

  let boxHeight = 34200
  let paddingTop = 2000
  let paddingBottom = 2000
  let width = 55880
  let height = boxHeight - paddingTop - paddingBottom

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
  var yearWidth = (width)/years.length
  var yearSlotPadding = yearWidth/20

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
      .rangeRoundBands([yearSlotPadding, yearWidth - yearSlotPadding], 0)

  var y = d3.scale.linear()
      .range([height, 0])

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('right')
      .ticks(3)
      .innerTickSize(width)
      .tickFormat((d) => d ? d : '')

  var svg = container.append('g')
      .attr('transform', `translate(${0},${paddingTop})`)

  x.domain(cols)
  y.domain([0, d3.max(years, (y) => d3.max(cols, (c) => +judet.years[y][c]))])

  let eachYear = svg.selectAll('.year')
      .data(years)
    .enter().append('g')

  eachYear.each(function(g, i) {
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
            .attr('height', (d) => height - y(+year[d]))
      })

  eachYear
    .append('g')
      .attr('transform', `translate(300,${height + 200})`)
    .append('g')
      .attr('transform', 'scale(1.2)')
    .append('path')
      .attr('style', 'stroke:#373435;stroke-width:17.64; fill:none;fill-rule:nonzero')
      .attr('transform', 'translate(-7639.18,-3598.2182)')
      .attr('d', 'm 12985,3600 c 0,83 -68,150 -151,150 m -5036,0 c -83,0 -150,-67 -150,-150 m 2518,109 -2368,41 m 2669,-41 c -83,0 -151,67 -151,151 0,-84 -67,-151 -150,-151 m 2668,41 -2367,-41')

  eachYear.append('g')
      .attr('transform', `translate(${yearWidth/2 + 150},${height + 1200})`)
      .append('text')
        .attr('style', 'font: 700px sans-serif; text-anchor: middle')
        .text((d) => d)

  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)

  svg.selectAll('.axis text')
      .attr('style', 'font: 400px sans-serif')
      .attr('transform', 'translate(-4,6)')
      .attr('x', 100)
      .attr('y', 250)

  svg.selectAll('.x.axis path').remove()
  svg.selectAll('.axis .domain').remove()

  svg.selectAll('.axis path').attr('style', 'stroke-width: 20px; fill: none; stroke: #000; shape-rendering: crispEdges')
  svg.selectAll('.axis line').attr('style', 'stroke-width: 20px; fill: none; stroke: #000; shape-rendering: crispEdges')

  //function multiYearLine(c) {
  //  var coords = years.map((year, i) => {
  //    return [yearWidth*i + x(c), height - y(+judet.years[year][c])]
  //  })
  //  return `M ${coords.join(' ')}`
  //}

  //svg.selectAll('.multiYearLine')
  //    .data(cols)
  //  .enter().append('path')
  //    .attr('d', multiYearLine)
}
