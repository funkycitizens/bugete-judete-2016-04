import fs from 'fs'
import jsdom from 'jsdom'
import d3 from 'd3'
import chart from './chart.js'

function loadTables() {
  return new Promise((resolve) => {
    let data_tsv = fs.readFileSync('data.tsv', {encoding: 'utf8'})
    let data = d3.tsv.parse(data_tsv)
    let judete_years = []
    let buffer = null
    let judet = null
    data.forEach(function(row) {
      if(row.judet) {
        if(buffer) flush()
        buffer = {}
        judet = row.judet
      }
      delete row.judet
      buffer[row.an] = row
      delete row.an
    })
    flush()

    function flush() {
      judete_years.push({
        name: judet,
        years: buffer,
      })
      buffer = []
    }

    let indicators = {}
    d3.tsv.parse(fs.readFileSync('indicators.tsv', {encoding: 'utf8'})).forEach((row) => {
      indicators[row.n] = row
    })

    let judete = d3.range(42).map((i) => {
      let ind = indicators[i+1]
      delete ind.jud
      delete ind.n
      return {
        name: judete_years[i].name,
        years: judete_years[i].years,
        indicators: ind,
      }
    })
    resolve(judete)
  })
}

function withJsdom(func) {
  return new Promise((resolve, reject) => {
    jsdom.env(`<html><body></body></html>`,
      [ 'http://d3js.org/d3.v3.min.js' ],
      function (err, window) {
        if(err) return reject(err)
        let rv = func(window)
        resolve(rv)
      })
  })
}

async function renderPage(master, judet) {
  return await withJsdom((window) => {
    let d3 = window.d3
    let zebox = d3.select('body').append('div')

    let headerOffset = master.indexOf('<svg')
    let header = master.slice(0, headerOffset)
    let svgSrc = master.slice(headerOffset)
    zebox.html(svgSrc)

    let plot = zebox.select('svg').append('g')
      .attr('transform', 'translate(4780,17710)')

    chart(d3, plot, judet, {width: 560, height: 343})

    for(let key of Object.keys(judet.indicators)) {
      let value = judet.indicators[key]
      zebox.select(`#${key}`).html(value)
    }

    return header + zebox.html()
  })
}

async function main() {
  let judete = await loadTables()
  let master = fs.readFileSync('master.svg', {encoding: 'utf8'})
  let out = await renderPage(master, judete[0])
  fs.writeFileSync('out.svg', out)
}

main().catch((e) => { console.error(e.stack || e) })
