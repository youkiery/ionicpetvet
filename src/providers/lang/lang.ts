import { Injectable } from '@angular/core';

@Injectable()
export class LangProvider {
  maintitle: string = "Bệnh viện thú cưng Thanh Xuân";
  logo: string = "Petcoffee";
  menu: string = "Danh mục";
  support: string = "Hỗ trợ";
  dog: string = "Mua bán chó";
  cat: string = "Mua bán mèo";
  other: string = "Linh tinh";
  about: string = "Thông tin";
  contact: string = "Liên hệ";
  account: string = "Tài khoản";
  account_manager: string = "Quản lý tài khoản";
  sale_manager: string = "Quản lý gian hàng";
  bookmark: string = "Mục yêu thích";
  user: string = "Người dùng";
  phone: string = "Số điện thoại";
  address: string = "Địa chỉ";
  save: string = "Lưu";
  tos: string = "bằng việc chọn đăng kí, nghĩ kà người dùng đã đồng ý với";
  private: string = "Điều khoản dịch vụ"
  existphone: string = "Số điện thoại đã đang được sử dụng";
  notallowed: string = "Không đủ quyền để thực hiện hành động này";
  notphoneallow: string = "Không được để trống số điện thoại";
  phoneformat: string = "Định dạng số điện thoại không được phép";
  index: string = "STT";
  role: string = "Chức vụ";
  roles: string = "Quyền hạn";
  login: string = "Đăng nhập";
  signup: string = "Đăng ký";
  logout: string = "Đăng xuất";
  username: string = "Tài khoản";
  name: string = "Tên";
  fullname: string = "Họ và tên";
  date: string = "Ngày sinh";
  price: string = "Giá";
  unit: string = "x.000 VNĐ";
  post: string = "Đăng bài";
  password: string = "Mật khẩu";
  npassword: string = "Mật khẩu mới";
  vpassword: string = "Xác nhận mật khẩu";
  nousername: string = "Đăng ký ngay";
  haveusername: string = "Đã có tài khoản";
  haventusername: string = "Tài khoản không tồn tại";
  incorrectpassword: string = "Mật khẩu không đúng";
  undefined: string = "Lỗi, vui lòng liên hệ 02626.290.609";
  existedusername: string = "Tài khoản đã tồn tại";
  upload: string = "Chọn ảnh";
  removequest: string = "Bạn chắc chắn muốn xóa chứ?";
  remove: string = "Xóa";
  cancel: string = "Huỷ";
  add: string = "Thêm";
  notinsert: string = "Dữ liệu lỗi, không thể thêm";
  insertfail: string = "Tải ảnh thất bại, không thể thêm";
  uploadsuccess: string = "Thêm thành công";
  uploadfail: string = "Tải ảnh lên thất bại, không thể thêm";
  removefail: string = "Lỗi mạng, không xóa được";
  removesuccess: string = "Đã xóa";
  editsuccess: string = "Đã sửa";
  title: string = "Tiêu đề";
  age: string = "Tuổi";
  description: string = "Giới thiệu";
  species: string = "Loài";
  admin_title: string = "Danh sách loại thú cưng";
  vaccine: string = "Số lần tiêm phòng";
  timeago: string = "Đã đăng";
  order: string = "Yêu cầu giao dịch";
  buy: string = "Giao dịch ngoài";
  sell: string = "Bài đăng";
  orderfail: string = "Lỗi mạng, chưa thể đặt";
  ordersuccess: string = "Đã đặt xong";
  keyword: string = "Từ khóa";
  sort: string = "Sắp xếp theo";
  filter: string = "Lọc";
  kind: string = "Loại";
  ordernote: string = "Nhắc nhở: cung cấp thông tin chính xác để đảo bảo quyền lợi bản thân";
  call: string = "Liên hệ với";
  vaccine_per: string = "mũi";
  list: string = "Hiển thị danh sách";
  notice: string = "Thông báo";
  chat: string = "Trò chuyện với gian hàng";
  poster: string = "Người đăng: ";
  sold: string = "Đã bán";
  bought: string = "Đã mua";
  changepass: string = "Đổi mật khẩu";
  changeprovince: string = "Đổi vùng";
  userinfo: string = "Thông tin người dùng";
  changeinfo: string = "Sửa thông tin";
  infomation: string = "Thông tin";
  thank: string = "Cảm ơn quý khách đã sử dụng hệ thống bình chọn";
  orderdetail: string = "Thông tin đặt hàng";
  customer: string = "Người đặt mua";
  public: string = "Công khai";
  unpublic: string = "Không công khai";
  nonameallow: string = "Không được bỏ trống tên";
  type: string = "Loại";
  vender: string = "Gian hàng của";
  home: string = "Trang chính";
  provider: string = "Chủ gian hàng";
  viewmore: string = "Chi tiết gian hàng";
  rate: string = "Đánh giá";
  totalrate: string = "Tổng lượt đánh giá";
  averagerate: string = "Đánh giá";
  totalsale: string = "Tổng giao dịch thành công";
  review: string = "Đánh giá từ khách hàng";
  province: string = "Vùng";
  pleaselogin: string = "Xin hãy đăng nhập để xem thông báo";
  loadmore: string = "Tải thêm";
  loading: string = "Đang tải";
  create: string = "Tạo thành viên";
  interneterror: string = "Thiết bị hiện đang offline, xin hãy thử lại sau";
  servererror: string = "Server quá tải, xin hãy thử lại sau";
  passnotmatch: string = "Mật khẩu xác nhận không trùng";
  usedphone: string = "Số điện thoại đã được sử dụng";
  userreview: string = "Đánh giá gian hàng";
  toreview: string = "Đánh giá";
  emptypass: string = "Mật khẩu không được để trống";
  emptynpass: string = "Mật khẩu mới không được để trống";
  emptytitle: string = "Tiêu đề không được để trống";
  slownet: string = "Mạng chậm, xin hãy chờ";
  incorrectvpass: string = "Mật khẩu xác nhận sai";
  totalratein1: string = "trên tổng";
  totalratein2: string = "đánh giá";
  changedprovince: string = "Đã thay đổi vùng";
  nointernet: string = "Không thể kết nối";
  reload: string = "Tải lại";
  msgreconnect: string = "Thiết bị đang offline, xin hãy tải lại trước";
  exitclick: string = "Nhấp một lần nữa để thoát";
  nocam: string = "Thiết bị không hỗ trợ";
  submitquest: string = "Xác nhận tin này?";
  submit: string = "Xác nhận";
  nodetail: string = "Bài đăng không tồn tại hoặc đã bị xóa";
  done: string = "Hoàn thành";
  ordercount: string = "lượt đặt";
  noformat: string = "Ảnh không hợp lệ"
  cate: string = "Danh mục"
  guest: string = "Khách"
  turn: string = "Ẩn/Hiện đã giao dịch"
  mating: string = "Yêu cầu phối"
  admin: string = "Quản trị"
  waitactive: string = "Chức năng chỉ khả dụng sau khi được kích hoạt"
  changerole: string = "Thay đổi chức vụ"
  member: string = "Thành viên"
  mod: string = "Mod"
  supermod: string = "SMod"
  add_species: string = "Thêm Loài"
  txphone: string = "Hotline: 02626.290.609";
  txaddress: string = "Địa chỉ: 12-14 Lê Đại Hành, Buôn Ma Thuột";
  txdescription: string = "Cửa hàng thú cưng: Kinh doanh thức ăn, đồ chơi, vật dụng, dầu tắm chó mèo";
  txdescription2: string = "Bệnh viện thú cưng: Có đội ngũ y, bác sĩ chuyên tư vấn các vấn đề chó mèo, chữa bệnh, tiêm phòng, phẫu thuật, triệt sản,...";
  txdescription3: string = "SPA thú cưng: Chuyên tắm gội, tỉa lông, làm đẹp chó mèo theo yêu cầu khách hàng";
  txdescription4: string = "Siêu thị - Bệnh viện thú cưng Thanh Xuân mở cửa từ 07:30 - 17:30 tất cả các ngày trong tuần, kể cả ngày lễ trừ mồng 1 tết";
  appsupport: string = "Petcoffee.com là ứng dụng mua bán chó mèo được thực hiển bởi Bệnh viện thú cưng Thanh Xuân. Nhằm mục đích liên kết khách hàng với chủ trại, người có nhu cầu với nhau.";
  appsupport2: string = "Thông tin liên lạc sẽ được cung cấp bởi các trại, nếu có bất kỳ vấn đề nào cần tư vấn xin liên hệ facebook: facebook.com/petcoffee.comvn Hoặc Hotline 02626.290.609";
  appsupport3: string = "Mọi đóng góp phát triển ứng dụng gửi mail đến youkiery@gmail.com";
  noti1: string = "vừa đặt đơn tại";
  noti2: string = "vừa hủy đơn ";
  noti3: string = "vừa đánh giá chủ đề";
  noti4: string = "vừa bình luận trong bài đăng";
  noti5: string = "vừa xóa bài đăng";
  noti6: string = "đã giao dịch thành công với";
  noti7: string = "Bạn vừa giao dịch thành công";
  noti8: string = "vừa thêm yêu cầu phối giống";
  noti9: string = "vừa hoàn thành phối giống";
  // home: string = "trang chủ";
  // user: string = "người dùng";
  // messenger: string = "thông báo";
  // menu: string = "bảng chọn";
  constructor() {

  }

}
