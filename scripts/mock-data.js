// const { PrismaClient } = require("@prisma/client");

// const prisma = new PrismaClient();

// async function main() {
//   console.log("Start mocking data...");

//   await prisma.costCenters.deleteMany({});
//   await prisma.costElements.deleteMany({});
//   await prisma.costGroups.deleteMany({});
//   await prisma.paymentMethods.deleteMany({});
//   await prisma.transactions.deleteMany({});
//   await prisma.zones.deleteMany({});

//   const costCenters = [
//     { code: "10000", name: "Gia đình ở Sài Gòn" },
//     { code: "10100", name: "Gia đình ở Tiền Giang" },
//     { code: "11000", name: "Giao tế" },
//     { code: "12100", name: "Phương An" },
//     { code: "12200", name: "Phương Anh" },
//     { code: "12300", name: "Mỹ Anh" },
//     { code: "12400", name: "Gia An" },
//     { code: "12500", name: "Thủ Nhân" },
//   ];
//   await prisma.costCenters.createMany({
//     data: costCenters,
//   });

//   const costGroups = [
//     { code: "CP01", name: "CP Thiết yếu" },
//     { code: "CP02", name: "Cp Tài chính" },
//     { code: "CP03", name: "Chi phí giáo dục" },
//     { code: "CP04", name: "Chi phí giao tế" },
//     { code: "CP05", name: "Chi phí dụng cụ, vật dụng" },
//     { code: "CP06", name: "Chi phí khác" },
//   ];
//   await prisma.costGroups.createMany({
//     data: costGroups,
//   });

//   const costGroupsDocument = await prisma.costGroups.findMany();
//   const CP01Id = costGroupsDocument.find((e) => e.code == "CP01").id;
//   const CP02Id = costGroupsDocument.find((e) => e.code == "CP02").id;
//   const CP03Id = costGroupsDocument.find((e) => e.code == "CP03").id;
//   const CP04Id = costGroupsDocument.find((e) => e.code == "CP04").id;
//   const CP05Id = costGroupsDocument.find((e) => e.code == "CP05").id;
//   const CP06Id = costGroupsDocument.find((e) => e.code == "CP06").id;

//   const costElements = [
//     {
//       code: "CP01-01",
//       name: "Phí gửi xe oto, xe máy",
//       costGroupId: CP01Id,
//     },
//     {
//       code: "CP01-02",
//       name: "Tiền thuốc",
//       costGroupId: CP01Id,
//     },
//     {
//       code: "CP01-03",
//       name: "Điếu hỷ",
//       costGroupId: CP01Id,
//     },
//     {
//       code: "CP01-04",
//       name: "Internet",
//       costGroupId: CP01Id,
//     },
//     {
//       code: "CP01-05",
//       name: "Tiền nước",
//       costGroupId: CP01Id,
//     },
//     {
//       code: "CP01-06",
//       name: "Tiền điện",
//       costGroupId: CP01Id,
//     },
//     {
//       code: "CP01-07",
//       name: "Xăng oto, xe máy",
//       costGroupId: CP01Id,
//     },
//     {
//       code: "CP01-08",
//       name: "Chi phí đi làm",
//       costGroupId: CP01Id,
//     },
//     {
//       code: "CP01-09",
//       name: "Tiền sữa",
//       costGroupId: CP01Id,
//     },
//     {
//       code: "CP01-10",
//       name: "Ăn uống cho gia đình",
//       costGroupId: CP01Id,
//     },

//     {
//       code: "CP02-01",
//       name: "Trả góp oto",
//       costGroupId: CP02Id,
//     },
//     {
//       code: "CP02-02",
//       name: "Lãi vay",
//       costGroupId: CP02Id,
//     },
//     {
//       code: "CP02-03",
//       name: "Đóng hụi",
//       costGroupId: CP02Id,
//     },
//     {
//       code: "CP02-04",
//       name: "Trả góp",
//       costGroupId: CP02Id,
//     },

//     {
//       code: "CP03-01",
//       name: "Tiền học phí",
//       costGroupId: CP03Id,
//     },
//     {
//       code: "CP03-02",
//       name: "Tiền học thêm",
//       costGroupId: CP03Id,
//     },
//     {
//       code: "CP03-03",
//       name: "Tiền học phí tích hợp",
//       costGroupId: CP03Id,
//     },
//     {
//       code: "CP03-04",
//       name: "Tiền học anh văn",
//       costGroupId: CP03Id,
//     },
//     {
//       code: "CP03-05",
//       name: "Tiền học liệu",
//       costGroupId: CP03Id,
//     },

//     {
//       code: "CP04-01",
//       name: "Đóng quỹ",
//       costGroupId: CP04Id,
//     },
//     {
//       code: "CP04-02",
//       name: "Giao tế",
//       costGroupId: CP04Id,
//     },

//     {
//       code: "CP05-01",
//       name: "Vật dụng gia đình",
//       costGroupId: CP05Id,
//     },

//     {
//       code: "CP06-01",
//       name: "Dự phòng",
//       costGroupId: CP06Id,
//     },
//   ];
//   await prisma.costElements.createMany({
//     data: costElements,
//   });

//   const paymentMethods = [
//     { code: "01", name: "Tiền mặt" },
//     { code: "02", name: "Chuyển khoản" },
//   ];
//   await prisma.paymentMethods.createMany({
//     data: paymentMethods,
//   });

//   const zones = [
//     { zoneName: "Khu vực 1", zoneDescription: "Sảnh" },
//     { zoneName: "Khu vực 2", zoneDescription: "Văn phòng" },
//   ];
//   await prisma.zones.createMany({
//     data: zones,
//   });

// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
