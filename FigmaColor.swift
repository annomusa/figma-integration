public enum FigmaColor {
    public static let blue = UIColor(0x329FE7)
    // public static let green = UIColor(0x00CC8B)
    // public static let orange = UIColor(0xFB9200)
}

private extension UIColor {
    convenience init(_ hexValue: UInt64, alphaValue: CGFloat = 1) {
        self.init(
            red: CGFloat((hexValue & 0xFF0000) >> 16) / 255.0,
            green: CGFloat((hexValue & 0x00FF00) >> 8) / 255.0,
            blue: CGFloat(hexValue & 0x0000FF) / 255.0,
            alpha: alphaValue
        )
    }
    
    convenience init(_ colorName: String) {
        self.init(named: colorName, in: SNExtensionsModule.bundle, compatibleWith: nil)!
    }
}
