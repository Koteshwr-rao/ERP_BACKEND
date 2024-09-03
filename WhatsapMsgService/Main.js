app.get('/send-whatsappmsg',async (req,res)=>{
    await sendWhatsappMessage("Test Solutions","7075965619","ord123456","Black UradDal","120",10560000.00,"https://res.cloudinary.com/dtgnotkh7/image/upload/v1725293713/xjfc6zzp5jshlvdghz5r.pdf")
    res.send("message sent")
})