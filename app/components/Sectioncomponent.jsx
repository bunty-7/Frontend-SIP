export default function SectionComponent() {
    return (
        <div className="bg-black text-white flex items-center justify-between px-20 py-20">

            {/* Left Section */}
            <div className="flex flex-col gap-8 max-w-[700px]">

                <h1 className="text-6xl font-bold">
                    Why KFintech?
                </h1>

                <h2 className="text-4xl font-bold text-cyan-400">
                    Secure Hyperscale Platform
                </h2>

                <p className="text-2xl leading-relaxed text-gray-300">
                    KFintech’s asset management platforms are the leading
                    investor and issuer servicing platforms. Our platforms
                    are highly resilient, secure and scalable even as they
                    are built on mobile-first microservices architecture
                    driven and cloud-ready frameworks.

                    KFintech has country specific platforms for asset
                    classes of Mutual Funds, ETFs, Alternatives and
                    Pensions for investor servicing & equities and bonds
                    for issuer servicing. KFintech platforms and data are
                    hosted in Tier IV data centers.
                </p>

            </div>

            {/* Right Section */}
            <div>
                <img
                    className="w-[500px] h-auto"
                    src="https://companieslogo.com/img/orig/KFINTECH.NS-ca980b4d.png?t=1720244492"
                    alt="KFintech"
                />
            </div>

        </div>
    );
}