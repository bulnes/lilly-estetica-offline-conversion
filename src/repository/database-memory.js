export class DataBaseMemory {
  data = new Map();

  saveUniqueId(uniqueId) {
    this.data.set(uniqueId, []);
  }

  saveOfflineConversion(uniqueId, conversion) {
    const user = this.data.get(uniqueId);

    user.conversions = user.conversions || [];
    user.conversions.push(conversion);
  }

  getOfflineConversions(uniqueId) {
    const user = this.data.get(uniqueId);

    return user.conversions;
  }
}
