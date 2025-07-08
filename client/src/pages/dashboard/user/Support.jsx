import { FaWhatsapp } from "react-icons/fa";

const Support = () => {
  const contacts = [
    { number: "01713784136", label: "Support 1" },
    { number: "01750873763", label: "Support 2" },
  ];

  return (
    <div className="max-w-md mx-auto mt-24 bg-white shadow-lg rounded-lg p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📞 Contact Support</h2>
      <ul className="space-y-4">
        {contacts.map((contact, index) => (
          <li key={index} className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-md">
            <span className="text-lg font-medium text-gray-700">{contact.number}</span>
            <a
              href={`https://wa.me/88${contact.number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-600"
              title={`WhatsApp ${contact.label}`}
            >
              <FaWhatsapp size={24} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Support;

