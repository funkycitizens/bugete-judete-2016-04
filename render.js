import fs from 'fs'
import jsdom from 'jsdom'
import d3 from 'd3'

function loadTables() {
  return new Promise((resolve) => {
    let data_tsv = fs.readFileSync('data.tsv', {encoding: 'utf8'})
    let data = d3.tsv.parse(data_tsv)
    let judete = []
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
      judete.push({
        name: judet,
        years: buffer,
      })
      buffer = []
    }

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

async function renderPage(master) {
  return await withJsdom((window) => {
    let d3 = window.d3
    let zebox = d3.select('body').append('div')

    let headerOffset = master.indexOf('<svg')
    let header = master.slice(0, headerOffset)
    let svgSrc = master.slice(headerOffset)
    zebox.html(svgSrc)

    return header + zebox.html()
  })
}

async function main() {
  let judete = await loadTables()
  let master = fs.readFileSync('master.svg', {encoding: 'utf8'})
  let out = await renderPage(master)
  fs.writeFileSync('out.svg', out)
}

main().catch((e) => { console.error(e.stack || e) })
