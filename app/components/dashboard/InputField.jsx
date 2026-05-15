export default function InputField({
    placeholder,
    type = "text",
    value,
    onChange,
    onKeyPress
}) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}          // ← Make sure this is here
            onChange={onChange}    // ← Make sure this is here
            onKeyPress={onKeyPress}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"  // ← Added text-gray-900
        />
    );
}