async function drawBubbleChart() {
    const dataset = await d3.csv("data/occurrence_per_nationality.csv")

    const countryName = d => d.data.country_name;
    const countryCode = d => d.data.country_code;
    const occurenceCount = d => +d.count;

    const continents = ["Asia", "Africa", "North America", "South America", "Europe", "Australia", "Antarctica"];
    const continentColors = ["#FFC300", "#FF5733", "#33FF57", "#C733FF", "#3371FF", "#FF33A1", "#AAAAAA"];

    const width = 800;
    let dimensions = {
        width: width,
        height: width,
        margin: {
            top: 40,
            right: 40,
            bottom: 40,
            left: 40
        }
    };

    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right;
    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom;

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    let bounds = wrapper.append("g")
        .attr("transform", `translate(${dimensions.margin.left},${dimensions.margin.top})`);

    const container = bounds.append("g");

    const zoom = d3.zoom()
        .scaleExtent([0.5, 5])
        .on("zoom", (event) => {
            container.attr("transform", event.transform);
        });

    wrapper.call(zoom);

    const colorScale = d3.scaleOrdinal()
        .domain(continents)
        .range(continentColors);

    const pack = d3.pack()
        .size([dimensions.boundedWidth, dimensions.boundedHeight])
        .padding(4);

    const root = d3.hierarchy({ children: dataset })
        .sum(d => occurenceCount(d));

    const nodes = pack(root).leaves();

    const nodeGroup = container.selectAll("g")
        .data(nodes)
        .join("g")
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .style("cursor", "pointer")

    nodeGroup.append("circle")
        .attr("r", d => d.r)
        .attr("class", "circle")
        .style("fill", d => colorScale(d.data.continent))
        .on("mouseenter", function(e, datum) {
            onMouseEnter(datum)
        })
        .on("mousemove", onMouseMove)
        .on("mouseleave", onMouseLeave)

    nodeGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em")
        .style("font-size", d => Math.min(d.r * 0.45, 14))
        .style("fill", "#000000")
        .text(d => countryCode(d))

    const tooltip = d3.select("#tooltip")
        .attr("class", "tooltip")

    function onMouseEnter(d) {
        tooltip.select("#country_name")
            .text(`${countryName(d)}:`)
        tooltip.select("#occurences")
            .text(`${occurenceCount(d.data)}`)
        tooltip.style("opacity", 0.9)
    }

    function onMouseMove(event) {
        tooltip.style("left", `${event.pageX}px`)
        tooltip.style("top", `${event.pageY}px`)
    }

    function onMouseLeave() {
        tooltip.style("opacity", 0)
    }
}
drawBubbleChart();
