const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

class EmailService {
  constructor() {
    // Email configuration - you can move this to environment variables
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });

    // Verify transporter configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.log('Email service error:', error);
      } else {
        console.log('Email service is ready to send messages');
      }
    });
  }

  // Load and compile email template
  loadTemplate(templateName) {
    try {
      const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      return handlebars.compile(templateSource);
    } catch (error) {
      console.error('Error loading email template:', error);
      throw error;
    }
  }

  // Send product created email
  async sendProductCreatedEmail(productData, recipientEmail) {
    try {
      const template = this.loadTemplate('productCreatedEmail');
      
      // Prepare template data
      const templateData = {
        productTitle: productData.title,
        productPrice: productData.price,
        productOldPrice: productData.oldPrice || null,
        productDescription: productData.description || 'Check out this amazing new product!',
        productBrand: productData.brand || 'Premium Brand',
        productGender: productData.gender || 'Unisex',
        productMaterial: productData.material || 'High Quality Material',
        productStyle: productData.style || 'Modern Style',
        productCategory: productData.category?.name || 'General',
        productSizes: productData.availableSizes ? productData.availableSizes.join(', ') : 'Various Sizes',
        productStock: productData.totalStock || productData.stock || 'Limited',
        productImage: productData.mainImages && productData.mainImages.length > 0 
          ? `${process.env.BASE_URL || 'http://localhost:8000'}${productData.mainImages[0].url}`
          : null,
        productUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/product?id=${productData._id}`,
        unsubscribeUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/unsubscribe`,
        preferencesUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/preferences`
      };

      // Compile template with data
      const htmlContent = template(templateData);

      // Email options
      const mailOptions = {
        from: {
          name: 'Your Store Name',
          address: process.env.EMAIL_USER || 'your-email@gmail.com'
        },
        to: recipientEmail,
        subject: `🎉 New Product Alert: ${productData.title}`,
        html: htmlContent,
        text: `New Product Alert: ${productData.title}\n\n${productData.description || 'Check out this amazing new product!'}\n\nPrice: $${productData.price}\n\nView Product: ${templateData.productUrl}`
      };

      // Send email
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Product created email sent successfully:', result.messageId);
      return result;

    } catch (error) {
      console.error('Error sending product created email:', error);
      throw error;
    }
  }

  // Send order confirmation email
  async sendOrderConfirmationEmail(orderData, customerEmail) {
    try {
      const template = this.loadTemplate('orderConfirmationEmail');
      
      const templateData = {
        orderId: orderData._id,
        customerName: orderData.customer?.fullName || 'Valued Customer',
        orderDate: new Date(orderData.createdAt).toLocaleDateString(),
        totalAmount: orderData.total,
        items: orderData.items || [],
        shippingAddress: orderData.shippingAddress || {},
        orderUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/order/${orderData._id}`,
        unsubscribeUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/unsubscribe`
      };

      const htmlContent = template(templateData);

      const mailOptions = {
        from: {
          name: 'Your Store Name',
          address: process.env.EMAIL_USER || 'your-email@gmail.com'
        },
        to: customerEmail,
        subject: `Order Confirmation #${orderData._id}`,
        html: htmlContent,
        text: `Order Confirmation #${orderData._id}\n\nThank you for your order!\n\nTotal: $${orderData.total}\n\nTrack your order: ${templateData.orderUrl}`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent successfully:', result.messageId);
      return result;

    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw error;
    }
  }

  // Send welcome email
  async sendWelcomeEmail(customerEmail, customerName) {
    try {
      const template = this.loadTemplate('welcomeEmail');
      
      const templateData = {
        customerName: customerName || 'Valued Customer',
        storeUrl: process.env.CLIENT_URL || 'http://localhost:5173',
        unsubscribeUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/unsubscribe`
      };

      const htmlContent = template(templateData);

      const mailOptions = {
        from: {
          name: 'Your Store Name',
          address: process.env.EMAIL_USER || 'your-email@gmail.com'
        },
        to: customerEmail,
        subject: 'Welcome to Your Store!',
        html: htmlContent,
        text: `Welcome to Your Store!\n\nThank you for joining us, ${customerName}!\n\nVisit our store: ${templateData.storeUrl}`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully:', result.messageId);
      return result;

    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  // Test email functionality
  async sendTestEmail(recipientEmail) {
    try {
      const mailOptions = {
        from: {
          name: 'Your Store Name',
          address: process.env.EMAIL_USER || 'your-email@gmail.com'
        },
        to: recipientEmail,
        subject: 'Test Email from Your Store',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Test Email</h2>
            <p>This is a test email to verify that the email service is working correctly.</p>
            <p>If you received this email, the configuration is successful!</p>
            <p style="color: #666; font-size: 14px;">Sent at: ${new Date().toLocaleString()}</p>
          </div>
        `,
        text: 'This is a test email to verify that the email service is working correctly.'
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Test email sent successfully:', result.messageId);
      return result;

    } catch (error) {
      console.error('Error sending test email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
