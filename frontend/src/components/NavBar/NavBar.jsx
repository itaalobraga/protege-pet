import logo from "../../assets/img/logo.png";
import Stack from "react-bootstrap/Stack";
function NavBar() {
  return (
    <>
      <Stack direction="horizontal" gap={5}>
        <div className="p-2 ms-5">
          <a href="#">
            <img
              alt="Logo da ONG"
              src={logo}
              width="80"
              height="60"
              className="d-inline-block align-top "
            />
          </a>
        </div>
        <div className="p-2 fw-bold fs-5" style={{ color: "#3F4D87" }}>
          SOCIEDADE PROTETORA DOS <br /> ANIMAIS ABANDONADOS
        </div>

        <div className="p-2 fw-bold fs-5" style={{ color: "#009951" }}>
          PRESIDENTE PRUDENTE
        </div>
      </Stack>
    </>
  );
}

export default NavBar;
