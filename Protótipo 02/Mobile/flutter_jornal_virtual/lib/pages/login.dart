import 'package:flutter/material.dart';
import 'inicial.dart'; // IMPORT DA TELA INICIAL

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  bool _animate = false;
  bool _obscurePassword = true;

  // CONTROLADORES
  final TextEditingController emailController = TextEditingController();
  final TextEditingController senhaController = TextEditingController();

  @override
  void initState() {
    super.initState();

    Future.delayed(const Duration(milliseconds: 100), () {
      setState(() {
        _animate = true;
      });
    });
  }

  // FUNÇÃO LOGIN
  void fazerLogin() {
    String email = emailController.text;
    String senha = senhaController.text;

    // EMAIL E SENHA CORRETOS
    if (email == "gioc@portalsesisp.org.br" && senha == "12345") {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Login realizado com sucesso")),
      );

      // IR PARA TELA INICIAL
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => const HomePage(),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("E-mail ou senha inválidos")),
      );
    }
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
              duration: const Duration(milliseconds: 800),
              opacity: _animate ? 1.0 : 0.0,
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 40),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        'Login',
                        style: TextStyle(
                          fontFamily: 'IBMSerif',
                          fontSize: 24,
                          fontWeight: FontWeight.w600,
                        ),
                      ),

                      const SizedBox(height: 100),

                      // EMAIL
                      TextField(
                        controller: emailController,
                        decoration: const InputDecoration(
                          hintText: "E-mail",
                          prefixIcon: Icon(
                            Icons.email,
                            color: Color.fromARGB(255, 0, 0, 0),
                          ),
                        ),
                      ),

                      const SizedBox(height: 15),

                      // SENHA
                      TextField(
                        controller: senhaController,
                        obscureText: _obscurePassword,
                        decoration: InputDecoration(
                          hintText: "Senha",
                          prefixIcon: const Icon(
                            Icons.lock,
                            color: Color.fromARGB(255, 0, 0, 0),
                          ),

                          // ÍCONE DE MOSTRAR SENHA
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword
                                  ? Icons.visibility_off
                                  : Icons.visibility,
                            ),
                            onPressed: () {
                              setState(() {
                                _obscurePassword = !_obscurePassword;
                              });
                            },
                          ),
                        ),
                      ),

                      GestureDetector(
                        onTap: () {},
                        child: const Text(
                          'Esqueci minha senha',
                          textAlign: TextAlign.right,
                          style: TextStyle(
                            fontFamily: 'IBMSerif',
                            fontSize: 16,
                            color: Color.fromARGB(255, 0, 0, 0),
                            decoration: TextDecoration.underline,
                          ),
                        ),
                      ),

                      const SizedBox(height: 30),

                      SizedBox(
                        width: 100,
                        height: 40,
                        child: ElevatedButton(
                          onPressed: fazerLogin,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xffffdfaf0),
                            foregroundColor:
                                const Color.fromARGB(255, 0, 0, 0),
                            elevation: 5,
                          ),
                          child: const Text(
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