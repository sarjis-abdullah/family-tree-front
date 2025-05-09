<template>
    <div class="tree-container">
        <svg ref="svg" class="full-screen-svg"></svg>
        <div id="tooltip" class="tooltip"></div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as d3 from 'd3'
import { UserService } from '~/services/UserService'

const svg = ref(null)
const users = ref({})
const mountTree = () => {


    const width = window.innerWidth
    console.log(width, 'width');
    const height = window.innerHeight

    const svg = d3.select("svg").attr("width", width).attr("height", height);

    // Add zoom behavior
    const g = svg.append("g");

    const zoom = d3
        .zoom()
        .scaleExtent([0.5, 3])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });
    svg.call(zoom);

    const root = d3.hierarchy(users.value[0]);
    const treeLayout = d3.tree().size([width - 100, height - 100]).separation((a, b) => (a.parent == b.parent ? 1 : 2));;
    treeLayout(root);

    function dragStarted(event, d) {
        d3.select(this).raise().attr("stroke", "black");
    }

    function dragged(event, d) {
        d.x = event.x - 50;
        d.y = event.y - 50;
        d3.select(this)
            .attr("transform", `translate(${event.x}, ${event.y})`);

        // Update connected links (optional but useful!)
        g.selectAll("line.link")
            .filter(l => l.source === d || l.target === d)
            .attr("x1", l => l.source.x + 50)
            .attr("y1", l => l.source.y + 50)
            .attr("x2", l => l.target.x + 50)
            .attr("y2", l => l.target.y + 50);
    }

    function dragEnded(event, d) {
        d3.select(this).attr("stroke", null);
    }

    const drag = d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);
    // Draw links
    g.selectAll("line.link")
        .data(root.links())
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", (d) => d.source.x + 50)
        .attr("y1", (d) => d.source.y + 50)
        .attr("x2", (d) => d.target.x + 50)
        .attr("y2", (d) => d.target.y + 50)
        .attr("stroke", "#555");

    // Tooltip div
    const tooltip = d3.select("#tooltip");

    // Draw nodes
    const node = g
        .selectAll("g.node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.x + 50}, ${d.y + 50})`)
        .call(drag)
        .on("mouseover", function (event, d) {
            tooltip
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - 20 + "px")
                .style("display", "inline-block")
                .html(
                    `<strong>${d.data.name}</strong><br>Gender: ${d.data.gender}<br>Mother: ${d.data.mo}<br>Father: ${d.data.fa}`
                );
            d3.select(this)
                .select("rect")
                .style("stroke", "orange")
                .style("stroke-width", 3);
        })
        .on("mouseout", function (event, d) {
            tooltip.style("display", "none");
            d3.select(this)
                .select("rect")
                .style("stroke", "#000")
                .style("stroke-width", 1);
        })
        .on("click", function (event, d) {
            alert(`Clicked on ${d.data.name}`);
        });

    node
        .append("rect")
        .attr("width", 200)
        .attr("height", 60)
        .attr("x", -100)
        .attr("y", -20)
        .style("fill", (d) => (d.data.gender === "M" ? "#88c" : "#c88"))
        .style("stroke", "#000");

    node
        .append("text")
        .attr("dy", 6)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text((d) => `${d.data.name}`);

    node
        .append("text")
        .attr("dy", 24)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "10px")
        .style("fill", "#666")
        .text((d) => d.data.mother_name ? `Mother: ${d.data.mother_name}` : "");
}
const loadUsers = async () => {
    const response = await UserService.getTree('')
    console.log(response);
    users.value = response.data.original;
    mountTree()
}
onMounted(() => {
    loadUsers();
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
</style>