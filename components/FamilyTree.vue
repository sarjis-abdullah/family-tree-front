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
    const root = d3.hierarchy(users.value[0]);

    // Dynamic height based on both depth and number of nodes
    const totalNodes = root.descendants().length;
    const maxDepth = root.height;

    // Choose whichever is bigger
    const height = Math.max(1000, totalNodes * 80, (maxDepth + 1) * 150);

    const svg = d3.select("svg").attr("width", width).attr("height", height);
    const g = svg.append("g");

    const zoom = d3
        .zoom()
        .scaleExtent([0.5, 3])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });
    svg.call(zoom);

    // const root = d3.hierarchy(users.value[0]);
    const treeLayout = d3.tree().size([height - 100, width - 100]).separation((a, b) => (a.parent == b.parent ? 1 : 2));
    treeLayout(root);

    // Draw links
    const links = g.selectAll("line.link")
        .data(root.links())
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", (d) => d.source.y + 50)
        .attr("y1", (d) => d.source.x + 50)
        .attr("x2", (d) => d.target.y + 50)
        .attr("y2", (d) => d.target.x + 50)
        .attr("stroke", "#555");

    const tooltip = d3.select("#tooltip");

    const nodes = g.selectAll("g.node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.y + 50}, ${d.x + 50})`)
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

    nodes.append("rect")
        .attr("width", 200)
        .attr("height", 60)
        .attr("x", -100)
        .attr("y", -20)
        .style("fill", (d) => (d.data.gender === "M" ? "#88c" : "#c88"))
        .style("stroke", "#000");

    nodes.append("text")
        .attr("dy", 6)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text((d) => `${d.data.name}`);

    // nodes.append("text")
    //     .attr("dy", -30)
    //     .attr("text-anchor", "middle")
    //     .attr("dominant-baseline", "middle")
    //     .style("font-size", "12px")
    //     .style("fill", "#666")
    //     .text((d) => `Generation: ${d.depth + 1}`);
    nodes.append("text")
        .attr("dy", 24)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "10px")
        .style("fill", "#666")
        .text((d) => d.data.mother_name ? `Mother: ${d.data.mother_name}` : "");

    function dragStarted(event, d) {
        d3.select(this).raise().attr("stroke", "black");

        // Find all descendants (subtree)
        d.subtree = d.descendants();
    }

    function dragged(event, d) {
        // Calculate the movement delta
        const dx = event.dy;
        const dy = event.dx;

        // Move all nodes in the subtree
        nodes.filter(n => d.subtree.includes(n))
            .each(function (n) {
                n.x += dx;
                n.y += dy;
                d3.select(this)
                    .attr("transform", `translate(${n.y + 50}, ${n.x + 50})`);
            });

        // Update links
        links.each(function (l) {
            if (d.subtree.includes(l.source)) {
                d3.select(this)
                    .attr("x1", l.source.y + 50)
                    .attr("y1", l.source.x + 50);
            }
            if (d.subtree.includes(l.target)) {
                d3.select(this)
                    .attr("x2", l.target.y + 50)
                    .attr("y2", l.target.x + 50);
            }
        });
    }

    function dragEnded(event, d) {
        d3.select(this).attr("stroke", null);
        d.subtree = null;  // Clean up
    }

    const drag = d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);

    nodes.call(drag);
    // Get the unique depths
    const depths = Array.from(new Set(root.descendants().map(d => d.depth)));

    // Add labels for each depth level
    depths.forEach(depth => {
        const nodesAtDepth = root.descendants().filter(d => d.depth === depth);
        const avgX = d3.mean(nodesAtDepth, d => d.x);

        // Add depth label at the left side of that column
        const label = g.append("text")
            .attr("x", nodesAtDepth[0].y)  // depth column y-position
            .attr("y", 10)  // fixed height at top
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text(`Generation: ${depth + 1}`)
            .style("fill", "#444")  // dark grey text
            .style("background", "#eee");
    });

}

const loadUsers = async () => {
    const response = await UserService.getTree('')
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
