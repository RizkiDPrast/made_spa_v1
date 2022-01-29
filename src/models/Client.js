export default class Client {
  constructor({
    id,
    code,
    icNumber,
    name,
    address,
    waPhone,
    otherPhones,
    email,
    notes,
    totalPets,
    totalSales,
    createdAt,
    modifiedAt,
    patients = []
  } = {}) {
    this.id = id;
    this.code = code;
    this.icNumber = icNumber;
    this.name = name;
    this.address = address;
    this.waPhone = waPhone;
    this.otherPhones = otherPhones;
    this.email = email;
    this.notes = notes;
    this.totalPets = totalPets;
    this.totalSales = totalSales;
    this.createdAt = createdAt;
    this.modifiedAt = modifiedAt;

    this.patients = patients;
  }
}
