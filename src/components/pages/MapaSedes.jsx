import { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../../App.scss";

export default function MapaSedes({ onClose }) {
    const svgRef = useRef(null);

    console.log("MapaSedes rendered");

    const sedes = [
        { id: "central", nombre: "Sede Central", color: "#4A90E2", x: 360, y: 245 }, // Centro de Cali
        { id: "norte", nombre: "Sede Norte", color: "#9B59B6", x: 375, y: 135 }, // Norte
        { id: "sur", nombre: "Sede Sur", color: "#E91E63", x: 310, y: 420 }, // Sur (abajo)
        { id: "este", nombre: "Sede Este", color: "#FF7043", x: 480, y: 260 }, // Este (derecha)
        { id: "oeste", nombre: "Sede Oeste", color: "#66BB6A", x: 250, y: 300 } // Oeste (izquierda)
    ];

    const links = [
        { source: "central", target: "norte" },
        { source: "central", target: "sur" },
        { source: "central", target: "este" },
        { source: "central", target: "oeste" }
    ];

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 624;
        const height = 616;

        // Crear el grupo principal
        const g = svg.append("g");

        // Agregar imagen de fondo de la ciudad
        g.append("image")
            .attr("href", "https://www.cali.gov.co/publico2/mapas/imagenes/comunas.gif")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .attr("opacity", 0.7)
            .style("pointer-events", "none");

        // Dibujar las líneas de conexión
        links.forEach((link) => {
            const sourceNode = sedes.find((s) => s.id === link.source);
            const targetNode = sedes.find((s) => s.id === link.target);

            g.append("line")
                .attr("x1", sourceNode.x)
                .attr("y1", sourceNode.y)
                .attr("x2", targetNode.x)
                .attr("y2", targetNode.y)
                .attr("stroke", "#ffffff")
                .attr("stroke-width", 3)
                .attr("stroke-dasharray", "5,5")
                .attr("opacity", 0.8);
        });

        // Dibujar los nodos (sedes)
        const nodes = g
            .selectAll(".node")
            .data(sedes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

        // Círculos de los nodos con sombra
        nodes
            .append("circle")
            .attr("r", 18)
            .attr("fill", (d) => d.color)
            .attr("stroke", "#fff")
            .attr("stroke-width", 3)
            .attr("filter", "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3))")
            .style("cursor", "pointer")
            .on("mouseover", function () {
                d3.select(this).transition().duration(200).attr("r", 22);
            })
            .on("mouseout", function () {
                d3.select(this).transition().duration(200).attr("r", 18);
            });

        // Etiquetas debajo de los nodos
        nodes
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "32")
            .attr("font-size", "14px")
            .attr("font-weight", "600")
            .attr("fill", "#333")
            .attr("text-shadow", "0 1px 2px rgba(255, 255, 255, 0.8)")
            .text((d) => d.nombre.split(" ")[1])
            .style("pointer-events", "none");

        // Zoom functionality
        const zoom = d3.zoom()
            .scaleExtent([0.5, 3])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        svg.call(zoom);
    }, []);

    return (
        <div className="mapaOverlay" onClick={onClose}>
            <div className="mapaModal" onClick={(e) => e.stopPropagation()}>
                <div className="mapaHeader">
                    <h3>Ubicación de Sedes en la Ciudad</h3>
                    <button className="mapaCloseBtn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="mapaContent">
                    <svg 
                        ref={svgRef} 
                        width="624" 
                        height="616" 
                        viewBox="0 0 624 616"
                        preserveAspectRatio="xMidYMid meet"
                        className="mapaGraph"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    ></svg>
                </div>
            </div>
        </div>
    );
}
