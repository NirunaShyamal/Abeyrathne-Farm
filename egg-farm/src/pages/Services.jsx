const Services = () => {
  const services = [
    {
      title: "Web Development",
      description: "We create responsive and modern websites using the latest technologies.",
      icon: "💻"
    },
    {
      title: "Mobile App Development",
      description: "We build cross-platform mobile applications for iOS and Android.",
      icon: "📱"
    },
    {
      title: "UI/UX Design",
      description: "We design intuitive and user-friendly interfaces.",
      icon: "🎨"
    }
  ];
  
  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Our Services</h1>
        <p className="text-gray-700">
          We offer a wide range of services to meet your business needs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">{service.icon}</div>
            <h2 className="text-xl font-semibold mb-3">{service.title}</h2>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;