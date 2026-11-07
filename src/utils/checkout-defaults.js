export function getCheckoutDefaults(user = {}, shipping = {}) {
  const text = (value) => typeof value === "string" ? value.trim() : "";
  const sameUser = shipping.userId
    ? Boolean(user._id) && shipping.userId === user._id
    : Boolean(text(user.email)) && text(shipping.email).toLowerCase() === text(user.email).toLowerCase();
  const saved = sameUser ? shipping : {};
  const profile = {
    firstName: text(user.firstName) || text(user.name),
    lastName: text(user.lastName),
    email: text(user.email),
    contactNo: text(user.phone) || text(user.contactNumber),
    address: text(user.address) || text(user.shippingAddress),
    country: text(user.country),
    city: text(user.city),
    zipCode: text(user.zipCode),
    orderNote: "",
  };
  return Object.fromEntries(Object.entries(profile).map(([key, value]) => [key, text(saved[key]) || value]));
}
