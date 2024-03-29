import React from "react";

function Footer() {
  return (
    <>
      <footer className="bg-dark-accent-light text-center text-darker-accent lg:text-left min-h-screen-30">
        <div className="text-center mx-2 md:mx-6 py-2 md:py-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
            <div className="mb-4 md:mb-0">
              <h6 className="mb-2 font-semibold uppercase text-black">
                Contact: info@example.com
              </h6>
              {/* <p className="mb-2 flex items-center justify-center md:justify-start text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-2 h-5 w-5"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
                info@example.com
              </p> */}
            </div>
            <div className="mb-4 md:mb-0">
              <h6 className="mb-2 font-semibold uppercase text-black">
                © 2023 Copyright: Retro Revival
              </h6>
              {/* <p
                className="mb-2 flex items-center justify-center md:justify-start text-black"
                href="https://tw-elements.com/"
              >
                Retro Revival
              </p> */}
            </div>
            {/* <div className="mb-4 md:mb-0 flex justify-center md:justify-start"> */}
            {/* <img
              src="https://i.ibb.co/w4CTq0R/updated.png"
              alt="Your Image Alt Text"
              className="mx-auto md:mx-0 max-h-10 max-w-10"
            /> */}
            {/* </div> */}
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
