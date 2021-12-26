/* 
    This code comes from https://codepen.io/mdeken/pen/exxawB
*/

import * as d3 from "https://cdn.skypack.dev/d3@5";

function graphChart () {
    let width = 500;
    let height = 500;
    let fillNode = '#07a0c3';
    let strokeNode = '#fff';
    let fillNodeHover = '#E47F74';
    let fillNeighbors = '#f0c808';
    let fillText = '#333';
    let strokeLink = d3.rgb(150, 150, 150, 0.6);
    let strokeLinkHover = d3.rgb(50, 50, 50, 1);
    let minRadius = 5;
    let radius = (node) => minRadius + (node.weight * 0.7);
    
    const chart = (selection) => selection.each(function (data) {
      const handleZoom = () => {
        let scale = d3.event.transform.k;
        g.attr('transform', `translate(${ d3.event.transform.x }, ${ d3.event.transform.y }) scale(${ scale })`);
      };
      
      const zoom = d3.zoom()
        .scaleExtent([1 / 4, 5])
        .on('zoom', handleZoom);
        
      const svg = d3.select(this)
        .attr("width", width)
        .attr("height", height)
        .call(zoom);
                
      const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.edges).id((d) => d.id).distance(50))
        .force('charge', d3.forceManyBody().strength((d) => (-radius(d) * 30)))
        .force('center', d3.forceCenter(width / 3, height / 2))
        .force('x', d3.forceX())
        .force('y', d3.forceY());
        
        const dragNode = (simulation) => {
          const dragstarted = (d) => {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          };
          
          const dragged = (d) => {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          };
          
          const dragended = (d) => {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          };
        
          return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
        };
        
        const getNeighbors = (node) => {
          const id = d3.select(node).attr('id');
          // Filter the links about the selected character
          const neighbors = data.edges.filter((link) => (link.source.id === id || link.target.id === id));
          
          // Creates an array with all the node id that has interacted with the selected node
          // The prepend hashtag will help us to select in CSS th nodes
          const neighbors_nodes = neighbors.map((link) => link.source.id === id ? '#' + link.target.id : '#' + link.source.id);
          
          var neighbors_edges = neighbors.map((d) => '#link_' + d.index).join(',');
          
          return {
            nodes: neighbors_nodes.join(),
            links: neighbors_edges
          };
        }
        
        const handleMouseOver = function (d, i) {
          const neighbors = getNeighbors(this);
          
          d3.select(this)
            .transition()
            .select('circle')
            .attr('fill', fillNodeHover);
          
          d3.select(this)
            .transition()
            .select('text')
            .attr('fill-opacity', 1);
          
          d3.selectAll(neighbors.nodes)
            .select('circle')
            .transition()
            .attr('fill', fillNeighbors);
          
          d3.selectAll(neighbors.nodes)
            .select('text')
            .transition()
            .attr('fill-opacity', 1);
          
          d3.selectAll(neighbors.links)
            .transition()
            .attr('stroke', strokeLinkHover);
        };
        
        const handleMouseOut = function (d, i) {
          const neighbors = getNeighbors(this);
          
          d3.select(this)
            .select('circle')
            .transition()
            .attr('fill', fillNode);
          
          d3.selectAll('.nodes text')
            .filter((d, i) => ( d.weight < 17))
            .transition()
            .attr('fill-opacity', 0);
          
          d3.selectAll(neighbors.nodes)
            .select('circle')
            .transition()
            .attr('fill', fillNode);
          
          d3.selectAll(neighbors.links)
            .transition()
            .attr('stroke', strokeLink);
        }
        
        const g = svg.append("g")
          .attr("id", "force-directed-graph");
        
        svg.call(zoom.transform, d3.zoomIdentity.scale(0.6).translate(width / 2, height / 2));
        
        const links = g.append("g")
          .attr("class", "links")
          .attr("stroke", strokeLink)
          .attr("stroke-opacity", 0.6)
          .selectAll("line")
          .data(data.edges)
          .enter()
            .append("line")
            .attr("stroke-width", 2)
            .attr('id', (d, i) => 'link_' + i);
     
        const nodes = g.append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(data.nodes)
          .enter()
            .append("g")
            .attr('class', 'node')
            .attr("id", d => d.id)
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut)
            .on('click', handleMouseOver)
            .call(dragNode(simulation));
        
        nodes.append("circle")
            .attr("r", (d) => radius(d) )
            .attr("fill", fillNode)
            .attr("stroke", strokeNode)
            .attr("stroke-width", 3);
        
        nodes
          .append("text")
          .text((d) => (d.label.toUpperCase()))
          .attr('fill', fillText)
          .attr('fill-opacity', 1)
          .attr('font-size', (d) => d.weight * 0.7)
          .attr("text-anchor", "middle")
          .filter((d, i) => ( d.weight < 17 ))
          .attr('fill-opacity', 0)
          .attr('font-size', 15);
        
        simulation.on("tick", () => {
          links
            .attr('x1', (d) => d.source.x)
            .attr('y1', (d) => d.source.y)
            .attr('x2', (d) => d.target.x)
            .attr('y2', (d) => d.target.y);
          
          nodes.selectAll("circle")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
          
          nodes.selectAll("text")
            .attr("x", d => d.x)
            .attr("y", d => d.y + (radius(d) / 4));
        });
      });
    
    chart.width = function (value) {
      if (!arguments.length) return width;
      width = value;
      return chart;
    };
    
    chart.height = function (value) {
      if (!arguments.length) return height;
      height = value;
      return chart;
    };
    
    chart.nodes = function (value) {
      if (!arguments.length) return nodes;
      nodes = value;
      return chart;
    };
    
    chart.edges = function (value) {
      if (!arguments.length) return edges;
      edges = value;
      return chart;
    };
    
    chart.fillNode = function (value) {
      if (!arguments.length) return fillNode;
      fillNode = value;
      return chart;
    };
    
    chart.fillNodeHover = function (value) {
      if (!arguments.length) return fillNodeHover;
      fillNodeHover = value;
      return chart;
    };
    
    chart.fillNeighbors = function (value) {
      if (!arguments.length) return fillNeighbors;
      fillNeighbors = value;
      return chart;
    };
    
    chart.radius = function (value) {
      if (!arguments.length) return radius;
      radius = value;
      return chart;
    };
    
    chart.fillText = function (value) {
      if (!arguments.length) return fillText;
      fillText = value;
      return chart;
    };
    
    chart.strokeNode = function (value) {
      if (!arguments.length) return strokeNode;
      strokeNode = value;
      return chart;
    };
    
    chart.strokeLinkHover = function (value) {
      if (!arguments.length) return strokeLinkHover;
      strokeLinkHover = value;
      return chart;
    };
    
    chart.strokeLink = function (value) {
      if (!arguments.length) return strokeLink;
      strokeLink = value;
      return chart;
    };
    
    return chart;
}
  
const renameNodesProperties = (d) => ({
    id: d.Id,
    label: d.Label,
});
  
const renameEdgesProperties = (d) => ({
    source: d.Source,
    target: d.Target,
    weight: +d.Weight,
});
  
const datasets = [
    ['https://raw.githubusercontent.com/madeka/gameofthrones/master/data/got-s1-nodes.csv', 'https://raw.githubusercontent.com/madeka/gameofthrones/master/data/got-s1-edges.csv'],
    ['https://raw.githubusercontent.com/mathbeveridge/gameofthrones/master/data/got-s2-nodes.csv', 'https://raw.githubusercontent.com/mathbeveridge/gameofthrones/master/data/got-s2-edges.csv'],
    ['https://raw.githubusercontent.com/mathbeveridge/gameofthrones/master/data/got-s3-nodes.csv', 'https://raw.githubusercontent.com/mathbeveridge/gameofthrones/master/data/got-s3-edges.csv'],
    ['https://raw.githubusercontent.com/madeka/gameofthrones/missing-nodes/data/got-s4-nodes.csv', 'https://raw.githubusercontent.com/madeka/gameofthrones/missing-nodes/data/got-s4-edges.csv'],
    ['https://raw.githubusercontent.com/madeka/gameofthrones/missing-nodes/data/got-s5-node.csv', 'https://raw.githubusercontent.com/madeka/gameofthrones/missing-nodes/data/got-s5-edges.csv'],
    ['https://raw.githubusercontent.com/madeka/gameofthrones/missing-nodes/data/got-s6-nodes.csv', 'https://raw.githubusercontent.com/madeka/gameofthrones/missing-nodes/data/got-s6-edges.csv'],
    ['https://raw.githubusercontent.com/mathbeveridge/gameofthrones/master/data/got-s7-nodes.csv', 'https://raw.githubusercontent.com/mathbeveridge/gameofthrones/master/data/got-s7-edges.csv'],
    ['https://raw.githubusercontent.com/madeka/gameofthrones/master/data/got-s8-nodes.csv',
     'https://raw.githubusercontent.com/madeka/gameofthrones/master/data/got-s8-edges.csv'],
];
  
const getDataFromSeason = (i) => [
    d3.csv(datasets[i][0], renameNodesProperties),
    d3.csv(datasets[i][1], renameEdgesProperties),
];
  
const width = parseInt(d3.select('#d3-graph').style('width'));
const height = parseInt(d3.select('#d3-graph').style('height'));
  
const graph = graphChart()
    .width(width)
    .height((height > 500) ? height : 500)
    .fillNode('#758686')
    .strokeNode('#494853')
    .fillNodeHover('#9d3a43')
    .fillNeighbors('#b38a38')
    .fillText('#fff')
    .strokeLinkHover(d3.rgb(250, 250, 250, 1));
  
const countLinks = (node, graphEdges) => graphEdges.reduce((total, link) => {
    if (node.id === link.source || node.id === link.target) total += 1;
    return total;
}, 0);
  
const draw_dataset = (i) => {
      Promise
      .all(getDataFromSeason(i))
      .then((data) => {
        const graph_data = {
          nodes: data[0],
          edges: data[1],
        };
        
        // Counts the number of links each nodes have with each other
        graph_data.nodes.forEach((d) => {
          d.weight = countLinks(d, graph_data.edges);
        });
  
          d3.select("#d3-graph").datum(graph_data).call(graph);
    })
}
  
d3.selectAll('.button').on('click', function(d, i) {
    d3.selectAll('.button.active')
      .attr('class', 'button');
    d3.select(this)
      .attr('class', 'button active');
    d3.select('#force-directed-graph').remove();
    
    draw_dataset(i);
});
  
d3.select('.button:first-child').attr('class', 'button active');
draw_dataset(0);