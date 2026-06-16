import 'dart:convert';
import 'package:http/http.dart' as http show post;

import 'package:flutter/material.dart';
import 'inicial.dart'; 

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  bool _animate = false;
  bool _obscurePassword = true;
  bool _isLoading = false; // NOVA VARIÁVEL PARA O CARREGAMENTO

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

  // FUNÇÃO LOGIN CONECTADA COM O BACKEND
  Future<void> fazerLogin() async {
    String email = emailController.text.trim();
    String senha = senhaController.text.trim();

    // Validação básica de campos vazios
    if (email.isEmpty || senha.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Por favor, preencha todos os campos")),
      );
      return;
    }

    // Ativa o círculo de carregamento e desativa cliques repetidos
    setState(() {
      _isLoading = true;
    });

    try {
      // Como você está na Web, usamos localhost:3000
      final url = Uri.parse('http://localhost:3000/usuarios/login');

      final resposta = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'senha': senha, // Deve bater exatamente com o que seu req.body espera no Node
        }),
      );

      // Se o backend retornou sucesso (Status 200 ou 201)
      if (resposta.statusCode == 200 || resposta.statusCode == 201) {
        final dados = jsonDecode(resposta.body);
        String token = dados['token'] ?? ''; // Guarda o token JWT gerado
        
        print('Login efetuado com sucesso! Token: $token');

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Login realizado com sucesso"), backgroundColor: Colors.green),
          );

          Navigator.pushReplacement( 
            context,
            MaterialPageRoute(
              builder: (context) => const HomePage(),
            ),
          );
        }
      } else if (resposta.statusCode == 401) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("E-mail ou senha incorretos"), backgroundColor: Colors.red),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Erro no servidor: ${resposta.statusCode}"), backgroundColor: Colors.amber),
          );
        }
      }
    } catch (erro) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Não foi possível conectar ao servidor: $erro"), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
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

                      TextField(
                        controller: emailController,
                        enabled: !_isLoading, 
                        decoration: const InputDecoration(
                          hintText: "E-mail",
                          prefixIcon: Icon(
                            Icons.email,
                            color: Color.fromARGB(255, 0, 0, 0),
                          ),
                        ),
                      ),

                      const SizedBox(height: 15),

                      TextField(
                        controller: senhaController,
                        obscureText: _obscurePassword,
                        enabled: !_isLoading,
                        decoration: InputDecoration(
                          hintText: "Senha",
                          prefixIcon: const Icon(
                            Icons.lock,
                            color: Color.fromARGB(255, 0, 0, 0),
                          ),
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

                      const SizedBox(height: 10),

                      GestureDetector(
                        onTap: () {},
                        child: const Align(
                          alignment: Alignment.centerRight,
                          child: Text(
                            'Esqueci minha senha',
                            style: TextStyle(
                              fontFamily: 'IBMSerif',
                              fontSize: 16,
                              color: Color.fromARGB(255, 0, 0, 0),
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 30),

                      SizedBox(
                        width: 120, 
                        height: 40,
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : fazerLogin, 
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0x0ffdfaf0),
                            foregroundColor: const Color.fromARGB(255, 0, 0, 0),
                            elevation: 5,
                          ),
                          child: _isLoading
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.black,
                                  ),
                                )
                              : const Text(
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