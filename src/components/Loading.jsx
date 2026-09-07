import React, { useState } from "react";

function Loading(props) {
  const [loading] = useState(props.value);
  return (
    <>
      {loading ? (
        <div className="container-xl mt-3">
          <div className="card">
            <div className="ratio ratio-21x9 card-img-top">
              <div className="skeleton-image" />
            </div>
            <div className="card-body">
              <div className="skeleton-heading" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Loading;
