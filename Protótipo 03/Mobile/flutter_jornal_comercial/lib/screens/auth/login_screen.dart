import 'package:flutter/material.dart';
import '../home/home_screen.dart';
import '../../core/theme/app_colors.dart';
import '../../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _senhaController = TextEditingController();

  final _authService = AuthService();

  bool _carregando = false;
  String? _erro;

  Future<void> _login() async {
    FocusScope.of(context).unfocus();

    setState(() {
      _carregando = true;
      _erro = null;
    });

    try {
      final response = await _authService.login(
        email: _emailController.text.trim(),
        senha: _senhaController.text,
      );

      if (!mounted) return;

      final usuario = response['usuario'];

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Login realizado! Olá, ${usuario['nome']}'),
          backgroundColor: AppColors.primary,
        ),
      );

      print('LOGIN OK');
      print('Usuário: ${response['usuario']}');

      if (!mounted) return;

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const HomeScreen()),
      );
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _erro = e.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      if (!mounted) return;

      setState(() {
        _carregando = false;
      });
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _senhaController.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Teste de Login')),

      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 400),

          child: Padding(
            padding: const EdgeInsets.all(24),

            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  'Entrar',
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                ),

                const SizedBox(height: 30),

                TextField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    labelText: 'E-mail',
                    hintText: 'Digite seu e-mail',
                  ),
                ),

                const SizedBox(height: 16),

                TextField(
                  controller: _senhaController,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Senha',
                    hintText: 'Digite sua senha',
                  ),
                ),

                const SizedBox(height: 20),

                if (_erro != null) ...[
                  Text(
                    _erro!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: AppColors.error),
                  ),

                  const SizedBox(height: 16),
                ],

                SizedBox(
                  width: double.infinity,
                  height: 50,

                  child: ElevatedButton(
                    onPressed: _carregando ? null : _login,

                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                    ),

                    child: _carregando
                        ? const SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : const Text('Entrar'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
