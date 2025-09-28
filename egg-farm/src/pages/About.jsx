const About = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">About Us</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <p className="text-gray-700 mb-4">
            We are a dedicated team of professionals committed to delivering exceptional services.
          </p>
          <p className="text-gray-700 mb-4">
            Our mission is to provide innovative solutions that help businesses grow.
          </p>
          <h2 className="text-xl font-semibold mb-3">Our Values</h2>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Customer Satisfaction</li>
            <li>Innovation and Creativity</li>
            <li>Integrity and Transparency</li>
            <li>Teamwork and Collaboration</li>
          </ul>
        </div>
        <div className="md:w-1/3">
          <div className="bg-blue-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Quick Facts</h3>
            <p className="mb-2"><span className="font-medium">Founded:</span> 2010</p>
            <p className="mb-2"><span className="font-medium">Team Members:</span> 50+</p>
            <p className="mb-2"><span className="font-medium">Clients Served:</span> 500+</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;