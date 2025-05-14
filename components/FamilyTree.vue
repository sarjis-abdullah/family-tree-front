<template>
    <div class="tree-container">
        <svg ref="svg" class="full-screen-svg"></svg>
        <div id="tooltip" class="tooltip"></div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as d3 from 'd3'

const { rootNode } = defineProps({
    rootNode: {
        type: Object,
        required: true,
        default: () => ({})
    }
})
const svg = ref(null)
const mountTree = () => {
    function getTreeDepth(node) {
        if (!node.children || node.children.length === 0) return 1
        return 1 + Math.max(...node.children.map(getTreeDepth))
    }


    const width = window.innerWidth;
    const root = d3.hierarchy(rootNode);

    /**
     * 
     *  const depth = getTreeDepth(root)
        const nodeWidth = 180 // pixels per depth level
        const width = Math.max(600, depth * nodeWidth) * 2
        console.log(width, window.innerWidth);
     */

    const height = calculateDynamicHeight(root);
    const svg = setupSVG(width, height);
    const g = svg.append("g");
    const zoom = setupZoom(svg, g);

    layoutTree(root, width, height);
    const nodes = root.descendants();

    const transform = calculateInitialTransform(svg, nodes);
    svg.call(zoom.transform, transform);

    const links = drawLinks(g, root);
    const tooltip = d3.select("#tooltip");
    const nodeElements = drawNodes(g, nodes, tooltip);

    setupDragBehavior(nodeElements, links);
    labelGenerations(g, root);
};

// Subfunctions:

function calculateDynamicHeight(root) {
    const totalNodes = root.descendants().length;
    const maxDepth = root.height;
    return Math.max(1000, totalNodes * 80, (maxDepth + 1) * 150);
}

function setupSVG(width, height) {
    return d3.select("svg").attr("width", width).attr("height", height);
}

function setupZoom(svg, g) {
    const zoom = d3.zoom().scaleExtent([0.1, 3]).on("zoom", event => {
        g.attr("transform", event.transform);
    });
    svg.call(zoom);
    return zoom;
}

function layoutTree(root, width, height) {
    const treeLayout = d3.tree()
        .size([height - 100, width - 100])
        .separation((a, b) => (a.parent === b.parent ? 1 : 2));
    treeLayout(root);
}

function calculateInitialTransform(svg, nodes) {
    const xExtent = d3.extent(nodes, d => d.x);
    const yExtent = d3.extent(nodes, d => d.y);
    const treeWidth = yExtent[1] - yExtent[0];
    const treeHeight = xExtent[1] - xExtent[0];
    const padding = 40;

    const svgWidth = +svg.attr("width");
    const svgHeight = +svg.attr("height");
    const scale = Math.min((svgWidth - padding * 2) / treeWidth, (svgHeight - padding * 2) / treeHeight);
    const offsetX = (svgWidth - (treeWidth * scale)) / 2;
    const offsetY = (svgHeight - (treeHeight * scale)) / 2;

    return d3.zoomIdentity
        .translate(offsetX - (yExtent[0] * scale), offsetY - (xExtent[0] * scale))
        .scale(.6);
}

function drawLinks(g, root) {
    return g.selectAll("line.link")
        .data(root.links())
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", d => d.source.y + 50)
        .attr("y1", d => d.source.x + 50)
        .attr("x2", d => d.target.y + 50)
        .attr("y2", d => d.target.x + 50)
        .attr("stroke", "#555");
}

function drawNodes(g, nodes, tooltip) {
    const nodeGroup = g.selectAll("g.node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y + 50}, ${d.x + 50})`)
        .on("mouseover", function (event, d) {
            tooltip
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - 20 + "px")
                .style("display", "inline-block")
                .html(`<strong>${d.data.name}</strong><br>Gender: ${d.data.gender}<br>Mother: ${d.data.mo}<br>Father: ${d.data.fa}`);
            d3.select(this).select("rect").style("stroke", "orange").style("stroke-width", 3);
        })
        .on("mouseout", function () {
            tooltip.style("display", "none");
            d3.select(this).select("rect").style("stroke", "#000").style("stroke-width", 1);
        })
        .on("click", function (event, d) {
            alert(`Clicked on ${d.data.name}`);
        });

    // nodeGroup.append("rect")
    //     .attr("width", 200)
    //     .attr("height", 60)
    //     .attr("x", -100)
    //     .attr("y", -20)
    //     .style("fill", d => (d.data.gender === "male" ? "#337ab7" : "#c88"))
    //     .style("stroke", "#000");

    nodeGroup.append("foreignObject")
    .attr("width", 200)
        .attr("height", 60)
        .attr("x", -100)
        .attr("y", -20)
        .html(d => `
        <div xmlns="http://www.w3.org/1999/xhtml" 
             class="node-text wordwrap" 
             style="
           background: #337ab7;
           color: white;
           padding: 12px;
           border-radius: 8px;
            box-shadow: 0px 0px 6px rgba(0,0,0,0.4);
           font-size: 12px;
           width: 110px;
           overflow: hidden;
         ">
            <b>${d.data.name}</b><br>
            <span>
            ${d.data.mother_name ? '<b>Mother: </b>' + d.data.mother_name + '<br>' : ''}
            </span>
        </div>
    `);

    // nodeGroup.append("text")
    //     .attr("dy", 6)
    //     .attr("text-anchor", "middle")
    //     .attr("dominant-baseline", "middle")
    //     .style("fill", "#fff")
    //     .text(d => d.data.name);

    // nodeGroup.append("text")
    //     .attr("dy", 24)
    //     .attr("text-anchor", "middle")
    //     .attr("dominant-baseline", "middle")
    //     .style("font-size", "10px")
    //     .style("fill", "#fff")
    //     .text(d => d.data.mother_name ? `Mother: ${d.data.mother_name}` : "");

    return nodeGroup;
}

function setupDragBehavior(nodes, links) {
    const drag = d3.drag()
        .on("start", function (event, d) {
            d3.select(this).raise().attr("stroke", "black");
            d.subtree = d.descendants();
        })
        .on("drag", function (event, d) {
            const dx = event.dy;
            const dy = event.dx;
            nodes.filter(n => d.subtree.includes(n))
                .each(function (n) {
                    n.x += dx;
                    n.y += dy;
                    d3.select(this).attr("transform", `translate(${n.y + 50}, ${n.x + 50})`);
                });
            links.each(function (l) {
                if (d.subtree.includes(l.source)) {
                    d3.select(this).attr("x1", l.source.y + 50).attr("y1", l.source.x + 50);
                }
                if (d.subtree.includes(l.target)) {
                    d3.select(this).attr("x2", l.target.y + 50).attr("y2", l.target.x + 50);
                }
            });
        })
        .on("end", function (event, d) {
            d3.select(this).attr("stroke", null);
            d.subtree = null;
        });

    nodes.call(drag);
}

function labelGenerations(g, root) {
    const depths = Array.from(new Set(root.descendants().map(d => d.depth)));
    depths.forEach(depth => {
        const nodesAtDepth = root.descendants().filter(d => d.depth === depth);
        g.append("text")
            .attr("x", nodesAtDepth[0].y)
            .attr("y", 10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text(`Generation: ${depth + 1}`)
            .style("fill", "#444");
    });
}

onMounted(() => {
    mountTree()
});
</script>

<style scoped>
.full-screen-svg {
    width: 100vw;
    height: 100vh;
    display: block;
}

.tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    pointer-events: none;
    display: none;
}

.node-text.wordwrap {
    word-wrap: break-word;
    overflow: hidden;
    text-align: left;
}
</style>
