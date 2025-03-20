import React from "react";

function Header({ levelOne, levelTwo }) {
  return (
    <div>
      <div className="content-header">
        <div className="d-flex justify-content-start">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a children="text-blue">{levelOne}</a>
              </li>
              <li className="breadcrumb-item">
                <a children="text-blue">{levelTwo}</a>
              </li>
              {/* <li className="breadcrumb-item active" aria-current="page">
                Content
              </li> */}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Header;
