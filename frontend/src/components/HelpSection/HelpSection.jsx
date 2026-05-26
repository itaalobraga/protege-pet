import { useId, useState } from "react";
import { Button, Card } from "react-bootstrap";
import "./helpSection.css";

function HelpSection({ content, title = "Help" }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (!content) {
    return null;
  }

  return (
    <Card className="help-section border-0 shadow-sm mb-4">
      <Card.Body className="p-3 p-md-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="help-section__eyebrow">{title}</div>
            <h6 className="mb-0 fw-semibold">{content.heading}</h6>
          </div>

          <Button
            type="button"
            variant={open ? "primary" : "outline-primary"}
            className="align-self-start align-self-md-center"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((current) => !current)}
          >
            {title}
          </Button>
        </div>

        {open && (
          <div id={panelId} className="help-section__content mt-3">
            {content.sections.map((section) => (
              <section key={section.title} className="mb-3">
                <h6 className="fw-semibold mb-2">{section.title}</h6>
                <ul className="mb-0 ps-3">
                  {section.items.map((item) => (
                    <li key={item} className="mb-1">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default HelpSection;
