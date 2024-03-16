const Header = ({ setActive, active }: any) => {
    return <header>
        <button className={active === "rectangle" ? "active" : ""} onClick={() => setActive("rectangle")}> Rectangle</button>
        <button className={active === "zoom_move" ? "active" : ""} onClick={() => setActive("zoom_move")}>Zoom move</button>
        <button className={active === "opacity" ? "active" : ""} onClick={() => setActive("opacity")}>Opacity</button>
    </header>
}

export default Header;