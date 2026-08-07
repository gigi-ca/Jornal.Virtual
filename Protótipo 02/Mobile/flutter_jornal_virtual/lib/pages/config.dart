import 'package:flutter/material.dart';
import 'package:flutter_jornal_virtual/pages/inicial.dart';
import 'perfil.dart';
import 'login.teste';

class ConfigPage extends StatefulWidget {
  const ConfigPage({super.key});

  @override
  State<ConfigPage> createState() => _ConfigPageState();
}

class _ConfigPageState extends State<ConfigPage> {
  bool _notificacoes = false;
  bool _visibilidadePerfil = false;
  bool _compartilharPerfil = false;

  void _mostrarModalSair(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          title: const Text(
            "Sair da Conta",
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          content: const Text("Você tem certeza que deseja sair da sua conta?"),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text(
                "Cancelar",
                style: TextStyle(color: Colors.grey, fontSize: 16),
              ),
            ),
            TextButton(
              onPressed: () {
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (_) =>  Login()),
                  (route) => false,
                );
              },
              child: const Text(
                "Sair",
                style: TextStyle(color: Color(0xFFD92B68), fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F1ED),
      appBar: AppBar(
        backgroundColor: const Color(0xFFD92B68),
        elevation: 0,
        automaticallyImplyLeading: false, 
        title: Stack(
          alignment: Alignment.center,
          children: [
            Align(
              alignment: Alignment.centerLeft,
              child: GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.arrow_back,
                    color: Colors.black,
                    size: 20,
                  ),
                ),
              ),
            ),
            const Center(
              child: Text(
                "Configurações",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 30),
          child: Column(
            children: [
              _buildMenuOption(
                icon: Icons.person_outline,
                title: "Sua Conta",
                trailing: const Icon(Icons.arrow_forward_ios, color: Color(0xFFD92B68), size: 18),
                onTap: () {},
              ),
              const Divider(color: Colors.black, thickness: 1.2, height: 30),
              _buildMenuOption(
                icon: Icons.notifications_none,
                title: "Notificações",
                trailing: Switch(
                  value: _notificacoes,
                  activeThumbColor: const Color(0xFFD92B68),
                  activeTrackColor: const Color(0xFFD92B68).withValues(alpha: 0.3),
                  inactiveThumbColor: Colors.white,
                  inactiveTrackColor: Colors.grey.shade300,
                  onChanged: (value) {
                    setState(() {
                      _notificacoes = value;
                    });
                  },
                ),
              ),
              const Divider(color: Colors.black, thickness: 1.2, height: 30),
              _buildMenuOption(
                icon: Icons.lock_open_outlined,
                title: "Privacidade",
                onTap: () {},
              ),
              const SizedBox(height: 25),
              _buildMenuOption(
                icon: Icons.visibility_outlined,
                title: "Visibilidade do perfil",
                trailing: Switch(
                  value: _visibilidadePerfil,
                  activeThumbColor: const Color(0xFFD92B68),
                  activeTrackColor: const Color(0xFFD92B68).withValues(alpha: 0.3),
                  inactiveThumbColor: Colors.white,
                  inactiveTrackColor: Colors.grey.shade300,
                  onChanged: (value) {
                    setState(() {
                      _visibilidadePerfil = value;
                    });
                  },
                ),
              ),
              const SizedBox(height: 25),
              _buildMenuOption(
                icon: Icons.share_outlined,
                title: "Compartilhar perfil",
                trailing: Switch(
                  value: _compartilharPerfil,
                  activeThumbColor: const Color(0xFFD92B68),
                  activeTrackColor: const Color(0xFFD92B68).withValues(alpha: 0.3),
                  inactiveThumbColor: Colors.white,
                  inactiveTrackColor: Colors.grey.shade300,
                  onChanged: (value) {
                    setState(() {
                      _compartilharPerfil = value;
                    });
                  },
                ),
              ),
              const SizedBox(height: 60),
              OutlinedButton(
                onPressed: () {
                  _mostrarModalSair(context);
                },
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFFD92B68), width: 2),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 12),
                ),
                child: const Text(
                  "Sair da conta",
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: Container(
        height: 65,
        color: const Color(0xFFD92B68),
        child: Row(
          children: [
            Expanded(
              child: IconButton(
                icon: const Icon(Icons.home, color: Colors.white, size: 30),
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (_) => const HomePage()),
                  );
                },
              ),
            ),
            const Expanded(
              child: IconButton(
                icon: Icon(Icons.menu, color: Colors.white, size: 30),
                onPressed: null,
              ),
            ),
            Expanded(
              child: IconButton(
                icon: const Icon(Icons.account_circle, color: Colors.white, size: 32),
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (_) => const PerfilPage()),
                  );
                },
              ),
            ),
            Expanded(
              child: Center(
                child: Container(
                  width: 50,
                  height: 50,
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.settings, color: Colors.black, size: 30),
                    onPressed: () {},
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuOption({
    required IconData icon,
    required String title,
    Widget? trailing,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        child: Row(
          children: [
            Icon(icon, size: 35, color: const Color(0xFFD92B68)),
            const SizedBox(width: 25),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                  color: Colors.black,
                ),
              ),
            ),
            if (trailing != null) trailing,
          ],
        ),
      ),
    );
  }
}