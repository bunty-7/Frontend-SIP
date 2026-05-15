export default function Header() {
    return (
        <div className="header bg-black text-white flex flex-row justify-evenly items-center">

            <img
                width={300}
                height={100}
                src="https://companieslogo.com/img/orig/KFINTECH.NS_BIG-5b3ec982.png"
                alt="logo"
            />


            <div className="flex flex-row space-x-4">
                <p>Solutions</p>
                <p>Products</p>
                <p>About Us</p>
                <p>Portfolio Companies</p>

            </div>

            <div className="flex flex-row space-x-4">
                <p>Careers</p>
                <p>Blog</p>
                <p>Contact Us</p>
                <p>Newsletter</p>

            </div>
        </div>
    );
}