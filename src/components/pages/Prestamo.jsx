import { useLocation } from "react-router-dom";

export default function Prestamo() {
    const { state } = useLocation();
    const libroId = state?.libroId;

    return <div>Préstamo del libro: {libroId}</div>;
}
