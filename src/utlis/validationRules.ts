class Rule {  //GPT han hanh tai tro chuong trinh any 
    // Kiểm tra email
    static email(email: string): boolean {
      // Regex chuẩn RFC 5322 cơ bản
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }
  
    // Kiểm tra password
    static password(password: string): boolean {
      // Ít nhất 8 ký tự, có ít nhất 1 chữ và 1 số
      const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return regex.test(password);
    }
  
    // Optional: thêm rule tên đầy đủ (chỉ chữ, space)
    static fullName(name: string): boolean {
      const regex = /^[A-Za-z\s]+$/;
      return regex.test(name);
    }
  }
  
  export default Rule;
  