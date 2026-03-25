import 'package:flutter/material.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  bool _animate = false;

  @override
  void initState() {
    super.initState();

    Future.delayed(const Duration(milliseconds: 100), () {
      setState(() {
        _animate = true;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedContainer(
        duration: const Duration(seconds: 1),
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFFDFAF0), Color(0xFFF65381)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Stack(
          children: [
            AnimatedAlign(
              duration: const Duration(seconds: 1),
              alignment: _animate ? Alignment.topCenter : Alignment.center,
              child: Padding(
                padding: const EdgeInsets.only(top: 35),
                child: Image.asset('/logos/jv.png', width: 300),
              ),
            ),
            AnimatedOpacity(
              duration: Duration(milliseconds: 800),
              opacity: _animate ? 1.0 : 0.0,
              child: Center(
                child: SingleChildScrollView(
                  padding: EdgeInsets.symmetric(horizontal: 40),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Login',
                        style: TextStyle(
                          fontFamily: 'IBMSerif',
                          fontSize: 24,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      SizedBox(height: 100),
                      TextField(
                        decoration: InputDecoration(
                          hintText: "E-mail",
                          prefixIcon: Icon(
                            Icons.email,
                            color: Color.fromARGB(255, 0, 0, 0),
                          ),
                        ),
                      ),
                      const SizedBox(height: 15),
                      TextField(
                        obscureText: true,
                        decoration: InputDecoration(
                          hintText: "Senha",
                          prefixIcon: Icon(
                            Icons.lock,
                            color: Color.fromARGB(255, 0, 0, 0),
                          ),
                        ),
                      ),
                      GestureDetector(
                        onTap: () {},
                        child: Text(
                          'Esqueci minha senha',
                          textAlign: TextAlign.right,
                          style: TextStyle(
                            fontFamily: 'IBMSerif',
                            fontSize: 16,
                            color: const Color.fromARGB(255, 0, 0, 0),
                            decoration: TextDecoration
                                .underline,
                          ),
                        ),
                      ),
                      SizedBox(height: 30),
                      SizedBox(
                        width: 100,
                        height: 40,
                        child: ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color(0xffffdfaf0),
                            foregroundColor: Color.fromARGB(255, 0, 0, 0),
                            elevation: 5,
                          ),
                          child: Text(
                            "Entrar",
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
