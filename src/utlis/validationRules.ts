class Rule {  //GPT han hanh tai tro chuong trinh any 
    // Kiểm tra email
    static email(email: string): boolean {
      // Regex chuẩn RFC 5322 cơ bản
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }
  
    // Kiểm tra password
    static password(password: string): boolean {
      const regex = /^(?=.*[A-Z])(?=.*\d).{12,}$/;
      return regex.test(password);
    }
    // Optional: thêm rule tên đầy đủ (chỉ chữ, space)
    static fullName(name: string): boolean {
      const regex = /^[A-Za-z\s]+$/;
      return regex.test(name);
    }
  }
  
  export default Rule;
  